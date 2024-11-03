import json
from sqlalchemy.orm import Session

from app import schemas
from app.models import Application, Candidate, Folder, Vacancy
from app.crud import candidate


def get_all(session: Session) -> list[str]:
    db_candidates = candidate.get_all(session)
    competencies = []
    for db_candidate in db_candidates:
        candidate_competencies = json.loads(db_candidate.competencies)
        competencies += [candidate_competence.get("name") for candidate_competence in candidate_competencies]

    print(competencies)
    return competencies
