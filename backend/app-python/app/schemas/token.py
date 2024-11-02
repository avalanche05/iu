from app.common import BaseSchema
from app.schemas.user import User


class TokenCreate(BaseSchema):
    username: str
    password: str


class Token(BaseSchema):
    access_token: str
    user: User
