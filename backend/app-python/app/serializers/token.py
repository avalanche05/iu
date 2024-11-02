from app import models, schemas
from app.serializers.user import get_user


def get_token(db_token: models.Token) -> schemas.Token:
    token = schemas.Token(
        access_token=db_token.access_token,
        user=get_user(db_token.user),
    )

    return token
