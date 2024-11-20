from pydantic import BaseModel,ConfigDict
from typing import Optional
from datetime import datetime

class PostBase(BaseModel):
    title: str
    content: str
    created_at: datetime

class PostCreate(PostBase):
    pass

class PostOut(PostBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class PostUpdate(PostBase):
    pass