import re
import os
from dotenv import load_dotenv
from fastapi import HTTPException, status
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from models.user import User
from sqlalchemy.orm import Session

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], default="bcrypt", deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=os.getenv("TOKEN_URL"))

def verify_password(plain_password: str, hashed_password: str) -> CryptContext:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> CryptContext:
    return pwd_context.hash(password)

# Función para crear un usuario administrador hardcoded
def create_admin_user(db: Session) -> None:
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    admin_name = os.getenv("ADMIN_NAME")
    admin_role = os.getenv("ADMIN_ROLE")

    # Verificar si el usuario administrador ya existe
    existing_admin = db.query(User).filter(User.email == admin_email).first()
    if existing_admin is None:
        hashed_password = get_password_hash(admin_password)
        new_admin = User(
            name=admin_name,
            email=admin_email,
            hashed_password=hashed_password,
            role=admin_role,
            is_active=True,
        )
        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)
