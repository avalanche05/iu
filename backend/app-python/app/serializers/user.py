from app import models, schemas


def get_user(db_user: models.User) -> schemas.User:
    return schemas.User(
        id=db_user.id,
        name=db_user.name,
        username=db_user.username,
    )
