from datetime import datetime
from typing import Literal

from pydantic import BaseModel
from typing import Literal
from datetime import datetime

class ResumeProcess(BaseModel):
    file_key: str


class Candidate(BaseModel):
    name: str
    phone: str
    email: str
    contacts: str
    skills: list[str]
    experience: float
    position: str
    grade: str
    speciality: str
    education: str
    summary: str
    city: str
    work_format: str

class ResumeProcessResponse(BaseModel):
    candidate: Candidate
     

class Vacancy(BaseModel):
    id: int
    position: str
    grade: Literal["junior", "middle", "senior"]
    speciality: str
    description: str
    team: str
    city: str
    work_format: Literal["online", "hybrid", "offline"]
    skills: list[str]
    created_at: datetime


class CandidateVacancy(BaseModel):
    vacancy: Vacancy
    candidates: list[Candidate]

class Folder(BaseModel):
    id: int
    name: str
    candidates_count: int

class CandidateFeedback(BaseModel):
    name: str
    position: str
    summary: str

class Vacancy(BaseModel):
    position: str
    description: str

class FeedbackRequest(BaseModel):
    action: str
    candidate: CandidateFeedback
    vacancy: Vacancy
    status: str

class Feedback(BaseModel):
    message: str
