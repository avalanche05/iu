from typing import Literal
from pydantic import HttpUrl

from app.common import BaseSchema
from app.schemas.competence import Competence


class Interview(BaseSchema):
    id: int
    summary: str
    competencies: list[Competence]
