from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.common import BaseEntity
from app.core.config import settings

print(str(settings.SQLALCHEMY_DATABASE_URI))
engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))

BaseEntity.metadata.create_all(bind=engine)
