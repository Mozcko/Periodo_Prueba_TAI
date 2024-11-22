from pydantic import BaseModel,ConfigDict
from typing import Optional
from datetime import datetime, timezone

class PostBase(BaseModel):
    title: str
    content: str
    created_at: Optional[datetime] = datetime.now(timezone.utc).isoformat()
    created_by: Optional[str] = "unknown"
    image_url: Optional[str] = None

class PostCreate(PostBase):
    pass

class PostOut(PostBase):
    id: int
    user_id: int
    created_at: datetime
    image_url: Optional[str] = None
    created_by: Optional[str] = "unknown"
    model_config = {"from_attributes": True}


class PostUpdate(PostBase):
    title: Optional[str]
    content: Optional[str]
    image_url: Optional[str] = None
    model_config = {"from_attributes": True}