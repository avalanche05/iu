from datetime import datetime
from typing import Literal

from app.common import BaseSchema
from app.schemas.user import User
from app.schemas.competence import Competence


class VacancyCreate(BaseSchema):
    title: str | None = None
    grade: Literal["junior", "middle", "senior"] | None = None
    description: str | None = None
    competencies: list[Competence] | None = None


class Vacancy(VacancyCreate):
    id: int
