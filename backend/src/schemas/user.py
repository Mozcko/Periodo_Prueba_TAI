from pydantic import BaseModel,ConfigDict
from typing import Optional

# esquema para creación de usuarios
class UserBase(BaseModel):
    name: str
    email: str
    password: str
    role: str
    is_active: bool

# esquema para actualización de usuarios
class UserUpdate(BaseModel):
    name: Optional[str]
    email: Optional[str]
    password: Optional[str]
    role: Optional[str]
    is_active: Optional[bool]

# esquema para obtener detalles de usuarios
class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    is_active: bool
    
    model_config = {"from_attributes": True}
        