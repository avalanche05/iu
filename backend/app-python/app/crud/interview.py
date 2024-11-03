import json
from sqlalchemy.orm import Session

from app import schemas
from app.models import Interview


def create(session: Session, interview: schemas.InterviewCreate, user: schemas.User, candidate_id: int) -> Interview:
    db_interview = Interview(
        summary=interview.summary,
        competencies=json.dumps([competence.dict() for competence in interview.competencies]),
        candidate_id=candidate_id,
    )
    session.add(db_interview)
    session.commit()
    session.refresh(db_interview)

    return db_interview
