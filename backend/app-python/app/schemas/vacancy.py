from datetime import datetime
from typing import Literal

from app.common import BaseSchema
from app.schemas.competence import Competence
from app.schemas.candidate import CandidateForVacancy


class VacancyCreate(BaseSchema):
    title: str | None = None
    grade: Literal["junior", "middle", "senior"] | None = None
    description: str | None = None
    competencies: list[Competence] | None = None


class Vacancy(VacancyCreate):
    id: int


class VacancyCandidateList(Vacancy):
    candidates: list[CandidateForVacancy]
