import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
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


# se comprueba el directorio static
if not os.path.exists("static"):
    os.makedirs("static")

app = FastAPI(
    title=os.getenv("APP_TITLE"),
    description=os.getenv("APP_DESCRIPTION"),
    version=os.getenv("APP_VERSION"),
    lifespan=lifespan,
)

allowed_hosts = os.getenv("ALLOWED_HOSTS").split(", ")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4321"
    ],  # Permite solicitudes solo desde este dominio
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los headers
)

# app.add_middleware(
#     TrustedHostMiddleware,
#     allowed_hosts=allowed_hosts
# )

# rutas
app.include_router(post.router, prefix="/posts", tags=["posts"])
app.include_router(user.router, prefix="/users", tags=["users"])

# ruta para uso de static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# no es necesario solo se usa para comprobar el estado en linea del servidor
# @app.get("/", tags=["Root"])
# def read_root():
#     return {"message": "API en linea"}
