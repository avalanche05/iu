from app.common import BaseSchema
from app.schemas import Vacancy, Candidate

class CandidateVacancy(BaseSchema):
    vacancy: Vacancy
    candidates: list[Candidate]
