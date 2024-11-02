import json
from sqlalchemy.orm import Session

from app import schemas
from app.models import Application, Candidate, Folder, Vacancy


def create(session: Session, interview: schemas.InterviewCreate, user: schemas.User) -> Folder:
    db_interview = Folder(
        summary=interview.summary,
        competencies=json.dumps([competence.dict() for competence in interview.competencies])
    )
    session.add(db_interview)
    session.commit()
    session.refresh(db_interview)

    return db_interview
