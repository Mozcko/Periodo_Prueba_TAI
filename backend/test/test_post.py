# /home/mozcko/Documents/Periodo_Prueba_TAI/backend/tests/test_post.py

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app
from database import Base, get_db
from models.user import User
from utils import get_password_hash
from datetime import datetime, timezone

# Create a new SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"  # Use SQLite for testing
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(
    scope="function"
)  # Use function scope to create a fresh database for each test
def client():
    # Drop the database tables if they exist and create new ones
    Base.metadata.drop_all(bind=engine)  # Drop all tables
    Base.metadata.create_all(bind=engine)  # Create all tables

    # Dependency override
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c


@pytest.fixture
def create_user():
    db = TestingSessionLocal()
    user = User(
        name="Test User",
        email="test@example.com",  # Use a unique email for the user
        hashed_password=get_password_hash("password"),
        is_active=True,
        role="admin_user",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user



def test_create_post(client, create_user):
    # Log in to get the access token
    response = client.post(
        "/users/login", data={"username": create_user.email, "password": "password"}
    )
    access_token = response.json()["access_token"]

    # Create a new post with the required fields
    response = client.post(
        "/posts/",
        json={
            "title": "Test Post",
            "content": "This is a test post.",
            "created_at": datetime.now(timezone.utc).isoformat(),  # Add created_at field
        },
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert (
        response.status_code == 201
    ), f"Create post failed: {response.status_code} - {response.text}"


def test_get_posts(client, create_user):
    # Log in to get the access token
    response = client.post(
        "/users/login", data={"username": create_user.email, "password": "password"}
    )
    assert (
        response.status_code == 200
    ), f"Login failed: {response.status_code} - {response.text}"
    access_token = response.json()["access_token"]

    # Create a new post
    post_response = client.post(
        "/posts/",
        json={
            "title": "Test Post",
            "content": "This is a test post.",
            "created_at": datetime.now(timezone.utc).isoformat(),  # Add created_at field
        },
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert (
        post_response.status_code == 201
    ), f"Create post failed: {post_response.status_code} - {post_response.text}"

    # Get all posts
    response = client.get("/posts/")
    assert (
        response.status_code == 200
    ), f"Get posts failed: {response.status_code} - {response.text}"
    assert len(response.json()) > 0, f"No posts found: {response.json()}"


def test_get_post(client, create_user):
    # Log in to get the access token
    response = client.post(
        "/users/login", data={"username": create_user.email, "password": "password"}
    )
    assert (
        response.status_code == 200
    ), f"Login failed: {response.status_code} - {response.text}"
    access_token = response.json()["access_token"]

    # Create a new post
    post_response = client.post(
        "/posts/",
        json={
            "title": "Test Post",
            "content": "This is a test post.",
            "created_at": datetime.now(timezone.utc).isoformat(),  # Add created_at field
        },
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert (
        post_response.status_code == 201
    ), f"Create post failed: {post_response.status_code} - {post_response.text}"
    post_id = post_response.json()["id"]

    # Get the specific post
    response = client.get(f"/posts/{post_id}")
    assert (
        response.status_code == 200
    ), f"Get post failed: {response.status_code} - {response.text}"
    assert (
        response.json()["title"] == "Test Post"
    ), f"Post title mismatch: {response.json()}"


def test_get_post(client, create_user):
    # Log in to get the access token
    response = client.post(
        "/users/login", data={"username": create_user.email, "password": "password"}
    )
    assert (
        response.status_code == 200
    ), f"Login failed: {response.status_code} - {response.text}"
    access_token = response.json()["access_token"]

    # Create a new post
    post_response = client.post(
        "/posts/",
        json={
            "title": "Test Post",
            "content": "This is a test post.",
            "created_at": datetime.now(timezone.utc).isoformat(),  # Add created_at field
        },
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert (
        post_response.status_code == 201
    ), f"Create post failed: {post_response.status_code} - {post_response.text}"
    post_id = post_response.json()["id"]

    # Get the specific post
    response = client.get(f"/posts/{post_id}")
    assert (
        response.status_code == 200
    ), f"Get post failed: {response.status_code} - {response.text}"
    assert (
        response.json()["title"] == "Test Post"
    ), f"Post title mismatch: {response.json()}"


def test_update_post(client, create_user):
    # Log in to get the access token
    response = client.post(
        "/users/login", data={"username": create_user.email, "password": "password"}
    )
    assert (
        response.status_code == 200
    ), f"Login failed: {response.status_code} - {response.text}"
    access_token = response.json()["access_token"]

    # Create a new post
    post_response = client.post(
        "/posts/",
        json={
            "title": "Test Post",
            "content": "This is a test post.",
            "created_at": datetime.now(timezone.utc).isoformat(),  # Add created_at field
        },
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert (
        post_response.status_code == 201
    ), f"Create post failed: {post_response.status_code} - {post_response.text}"
    post_id = post_response.json()["id"]

    # Update the post
    update_response = client.put(
        f"/posts/{post_id}",
        json={
            "title": "Updated Test Post",
            "content": "This is an updated test post.",
            "created_at": datetime.now(timezone.utc).isoformat(),  # Include created_at field
        },
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert (
        update_response.status_code == 200
    ), f"Update post failed: {update_response.status_code} - {update_response.text}"
    assert (
        update_response.json()["title"] == "Updated Test Post"
    ), f"Post title mismatch after update: {update_response.json()}"


def test_delete_post(client, create_user):
    # Log in to get the access token
    response = client.post(
        "/users/login", data={"username": create_user.email, "password": "password"}
    )
    assert (
        response.status_code == 200
    ), f"Login failed: {response.status_code} - {response.text}"
    access_token = response.json()["access_token"]

    # Create a new post
    post_response = client.post(
        "/posts/",
        json={
            "title": "Test Post",
            "content": "This is a test post.",
            "created_at": datetime.now(timezone.utc).isoformat(),  # Add created_at field
        },
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert (
        post_response.status_code == 201
    ), f"Create post failed: {post_response.status_code} - {post_response.text}"
    post_id = post_response.json()["id"]

    # Delete the post
    delete_response = client.delete(
        f"/posts/{post_id}", headers={"Authorization": f"Bearer {access_token}"}
    )
    assert (
        delete_response.status_code == 204
    ), f"Delete post failed: {delete_response.status_code} - {delete_response.text}"

    # Try to get the deleted post
    get_response = client.get(f"/posts/{post_id}")
    assert (
        get_response.status_code == 404
    ), f"Post should be deleted but was found: {get_response.status_code} - {get_response.text}"
