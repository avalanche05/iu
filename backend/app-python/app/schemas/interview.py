from typing import Literal
from pydantic import HttpUrl

from app.common import BaseSchema
from app.schemas.competence import Competence


class InterviewCreate(BaseSchema):
    summary: str
    competencies: list[Competence]


class Interview(InterviewCreate):
    id: int
