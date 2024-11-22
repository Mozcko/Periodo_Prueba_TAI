from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base, engine


class Post(Base):
    __tablename__ = 'post'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    title = Column(String, index=True)
    content = Column(String)
    created_at = Column(DateTime, default=datetime.now(timezone.utc).isoformat())
    created_by = Column(String, default='unknown')
    image_url = Column(String, nullable=True)
    # TODO: agregar comentarios a los posts (si da tiempo)

    user = relationship("User", back_populates="posts")