import os
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from models.post import Post
from models.user import User
from schemas.post import PostCreate, PostBase, PostOut, PostUpdate
from typing import Optional
from datetime import datetime, timezone

from dependencies import get_db, get_current_active_user, get_admin_user

router = APIRouter()


@router.post("/", response_model=PostOut, status_code=status.HTTP_201_CREATED)
async def create_post(
    title: str = Form(...),
    content: str = Form(...),
    created_at: Optional[str] = Form(None),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    # Convertir la fecha si se proporciona
    created_at_datetime = (
        datetime.fromisoformat(created_at) if created_at else datetime.now()
    )

    image_url = await upload_image(image)

    new_post = Post(
        title=title,
        content=content,
        created_at=created_at_datetime,  # Usar un objeto datetime
        created_by=current_user.name,
        image_url=image_url,
        user_id=current_user.id,
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post


@router.get("/", response_model=list[PostOut])
def get_posts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    posts = db.query(Post).offset(skip).limit(limit).all()
    return posts


@router.get("/{post_id}", response_model=PostOut)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Post not found"
        )
    return post


@router.put("/{post_id}", response_model=PostOut)
async def update_post(
    post_id: int,
    title: str = Form(None),
    content: str = Form(None),
    image: UploadFile = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
):
    # Obtener el post existente
    db_post = (
        db.query(Post)
        .filter(Post.id == post_id, Post.user_id == current_user.id)
        .first()
    )

    if not db_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found or not authorized to update",
        )

    # Verificar permisos de admin o propietario
    if current_user.id != db_post.user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para modificar este post",
        )

    # Actualizar el título y contenido si se proporcionan
    if title:
        db_post.title = title
    if content:
        db_post.content = content

    # Actualizar la imagen si se proporciona
    if image:
        image_url = await upload_image(image)
        db_post.image_url = image_url

    db.commit()
    db.refresh(db_post)
    return db_post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    db_post = (
        db.query(Post)
        .filter(Post.id == post_id, Post.user_id == current_user.id)
        .first()
    )

    if not db_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found or not authorized to delete",
        )

    if current_user.id != db_post.user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para modificar este usuario",
        )

    db.delete(db_post)
    db.commit()
    return


@router.post("/upload-image/", response_model=str)
async def upload_image(file: UploadFile = File(...)):
    # Define el directorio donde se guardarán las imágenes
    upload_directory = "static/images/"
    os.makedirs(upload_directory, exist_ok=True)  # Crea el directorio si no existe

    file_location = f"{upload_directory}{file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(await file.read())

    return file_location
