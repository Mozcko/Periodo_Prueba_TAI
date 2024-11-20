import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from routes import user, post
from database import create_db_and_tables, get_db
from utils import create_admin_user
from dependencies import get_current_active_user
from contextlib import asynccontextmanager

# from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        create_db_and_tables()
        db = next(get_db())
        create_admin_user(db)
        yield
    finally:
        pass

app = FastAPI(
    title=os.getenv("APP_TITLE"),
    description=os.getenv("APP_DESCRIPTION"),
    version=os.getenv("APP_VERSION"),
    lifespan=lifespan
)

allowed_hosts = os.getenv("ALLOWED_HOSTS").split(', ')

app.middleware(
    CORSMiddleware,
)

# app.add_middleware(
#     TrustedHostMiddleware,
#     allowed_hosts=allowed_hosts
# )

# rutas
app.include_router(post.router, prefix="/posts", tags=["posts"])
app.include_router(user.router, prefix="/users", tags=["users"])


# no es necesario solo se usa para comprobar el estado en linea del servidor
# @app.get("/", tags=["Root"])
# def read_root():
#     return {"message": "API en linea"}


