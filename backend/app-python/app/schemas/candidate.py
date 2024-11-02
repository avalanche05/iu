from enum import Enum
from typing import Literal
from pydantic import HttpUrl

from app.common import BaseSchema
from app.schemas.folder import Folder
from app.schemas.competence import Competence
from app.schemas.interview import Interview


class CandidateCreate(BaseSchema):
    nickname: str
    email: str
    github_url: HttpUrl
    grade: Literal["junior", "middle", "senior"]
    experience_years: int
    summary: str
    code_quality: float
    competencies: list[Competence]
    folders: list[str]


class Candidate(CandidateCreate):
    id: int
    nickname: str
    email: str
    github_url: HttpUrl
    grade: Literal["junior", "middle", "senior"]
    experience_years: int
    summary: str
    code_quality: float
    competencies: list[Competence]
    folders: list[Folder]
    technical_interview_result: Interview | None = None

