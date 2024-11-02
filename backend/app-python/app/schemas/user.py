from app.common import BaseSchema


class User(BaseSchema):
    id: int
    name: str
    username: str


class UserCreateRequest(BaseSchema):
    name: str
    username: str
    password: str


class UserLoginRequest(BaseSchema):
    username: str
    password: str
