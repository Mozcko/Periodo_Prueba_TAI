import os
from dotenv import load_dotenv
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from models.user import User
from database import get_db
from utils import get_password_hash, create_admin_user

load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=os.getenv("TOKEN_URL"))

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS"))

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED, detail="", headers=()
)


def create_access_token(data: dict) -> str:
    import time

    to_encode: dict = data.copy()
    expire: int = int(time.time()) + ACCESS_TOKEN_EXPIRE_HOURS * 3600
    to_encode.update({"exp": expire})
    encoded_jwt: str = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_admin(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        role: str = payload.get("role")
        if role is None or role != "admin_user":
            raise credentials_exception
        admin = db.query(User).filter(User.email == email).first()
        if admin is None:
            create_admin_user()
        return admin
    except JWTError:
        raise credentials_exception


def get_current_active_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise credentials_exception
        return user
    except JWTError:
        raise credentials_exception


def get_admin_user(current_user: User = Depends(get_current_admin)) -> User:
    if current_user.role != "admin_user":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="No hay permisos de admin"
        )
    return current_user


# def get_read_write_user(current_user: User = Depends(get_current_admin)) -> User:
#     if current_user.role not in ["admin_user", "rw_user"]:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="No hay permisos suficientes",
#         )
#     return current_user


def get_user_permissions(current_user: User = Depends(get_current_active_user)) -> str:
    return current_user.role


def get_user_by_email(db: Session, email: str) -> User:
    return db.query(User).filter(User.email == email).first()  # type: ignore
