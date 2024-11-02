from sqlalchemy import not_, or_
from sqlalchemy.orm import Session

from app import schemas
from app.models import User, Token


def create(session: Session, user: schemas.User) -> User:
    db_user = session.query(User).filter(User.username == user.username).first()
    if db_user is not None:
        raise ValueError("Email already associated")

    db_user = User(
        username=user.username,
        name=user.name,
    )
    db_user.set_password(user.password)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user

def read_user_by_token(session: Session, token: str) -> User:
    db_token = session.query(Token).filter(Token.access_token == token).first()
    if db_token is None:
        return None
    else:
        return db_token.user




