from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserBase, UserOut, UserUpdate
from dependencies import (
    get_db,
    get_admin_user,
    get_current_active_user,
    create_access_token,
)
from utils import get_password_hash, verify_password
from passlib.context import CryptContext

# Configuración de contraseña
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter()


# Registrar un usuario nuevo
@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(user: UserBase, db: Session = Depends(get_db)):
    # Verifica si el usuario ya existe
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email ya existente"
        )

    # Hashea la contraseña
    hashed_password = get_password_hash(user.password)
    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,  # Corregido a hashed_password
        is_active=user.is_active,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Devuelve solo la información necesaria sin el campo 'password'
    return new_user


# Inicio de sesión con access token
@router.post("/login", response_model=dict, status_code=status.HTTP_200_OK)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(
        form_data.password, user.hashed_password
    ):  # Verifica el hash de la contraseña
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}


# Actualizar la información del usuario
@router.put("/{user_id}", response_model=UserOut, status_code=status.HTTP_200_OK)
def update_user(
    user_id: int,
    user: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado o inexistente",
        )

    # Verifica si el usuario está intentando modificar sus propios datos o si es un administrador
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para modificar este usuario",
        )

    # Actualiza los campos del usuario
    if user.name is not None:
        db_user.name = user.name
    if user.email is not None:
        db_user.email = user.email
    if user.password is not None:
        db_user.hashed_password = get_password_hash(
            user.password
        )  # Hashea la nueva contraseña
    if user.role is not None:
        db_user.role = user.role
    if user.is_active is not None:
        db_user.is_active = user.is_active

    db.commit()
    db.refresh(db_user)
    return db_user


# Eliminar un usuario
@router.delete("/{user_id}", response_model=UserOut, status_code=status.HTTP_200_OK)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado o inexistente",
        )

    db.delete(db_user)
    db.commit()
    return db_user


# Obtener la información del usuario actual
@router.get("/me", response_model=UserOut, status_code=status.HTTP_200_OK)
def get_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return current_user


# Desactivar un usuario (nuevo endpoint)
@router.put(
    "/{user_id}/deactivate", response_model=UserOut, status_code=status.HTTP_200_OK
)
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
):
    db_user = db.query(User).filter(User.id == user_id).first()

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado o inexistente",
        )

    # Desactiva al usuario
    db_user.is_active = False
    db.commit()
    db.refresh(db_user)
    return db_user
