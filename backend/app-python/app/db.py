from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.models.common import BaseEntity

engine = create_engine("sqlite:///database.db")


BaseEntity.metadata.create_all(engine)
