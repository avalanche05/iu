from sqlalchemy.orm import Session

from app.models import Token, User


def login(session: Session, username: str, password: str) -> User:
    user = session.query(User).filter(User.username == username).first()
    if user and user.check_password(password):
        return user
    raise ValueError("Login error")


def create_token(session: Session, user_id: int) -> Token:
    db_token = Token(
        user_id=user_id,
    )
    session.add(db_token)
    session.commit()
    session.refresh(db_token)

    return db_token


def get_user_by_token(session: Session, token: str) -> User:
    db_token = session.query(Token).filter(Token.access_token == token).first()
    if db_token:
        return db_token.user
