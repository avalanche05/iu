from datetime import datetime
from typing import Literal

from app.common import BaseSchema
from app.schemas.user import User


class VacancyCreate(BaseSchema):
    position: str
    grade: Literal["junior", "middle", "senior"]
    speciality: str
    description: str
    team: str
    city: str
    work_format: Literal["online", "hybrid", "offline"]
    skills: list[str]


class Vacancy(VacancyCreate):
    id: int
    created_at: datetime
    user: User
