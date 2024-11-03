from enum import Enum
from typing import Literal
from pydantic import HttpUrl

from app.common import BaseSchema
from app.schemas.folder import Folder
from app.schemas.competence import Competence
from app.schemas.interview import Interview
from app.schemas.metric import Metric


class CandidateCreate(BaseSchema):
    nickname: str
    email: str
    github_url: HttpUrl
    grade: Literal["junior", "middle", "senior"]
    experience_years: int
    summary: str
    code_quality: float
    competencies: list[Competence] | None = None
    metrics: Metric


class Candidate(CandidateCreate):
    id: int
    technical_interview_result: Interview | None = None
    folders: list[Folder]


class CandidateForVacancy(Candidate):
    compliance_percent: float

