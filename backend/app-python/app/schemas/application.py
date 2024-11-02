from datetime import datetime
from typing import Literal

from app.common import BaseSchema
from app.schemas.candidate import Candidate
from app.schemas.vacancy import Vacancy


class ApplicationCreate(BaseSchema):
    candidate_id: int
    vacancy_id: int


class ApplicationStatusUpdate(BaseSchema):
    status: Literal[
        "pending",
        "hrAccepted",
        "hrDeclined",
        "interview",
        "interviewerAccepted",
        "interviewerDeclined",
        "offer",
        "candidateAccepted",
        "candidateDeclined",
    ] = "pending"


class Application(BaseSchema):
    id: int
    vacancy: Vacancy
    candidate: Candidate
    status: Literal[
        "pending",
        "hrAccepted",
        "hrDeclined",
        "interview",
        "interviewerAccepted",
        "interviewerDeclined",
        "offer",
        "candidateAccepted",
        "candidateDeclined",
    ] = "pending"
    created_at: datetime
