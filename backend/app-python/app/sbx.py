import app
import app.models.user
from app.api.deps import get_db
from app.common import BaseEntity
from app.core.db import engine

BaseEntity.metadata.create_all(bind=engine)
session = next(get_db())
user = app.models.user.User(
    name="t2",
    hashed_password="123",
)

session.add(user)
session.commit()
