import json
from sqlalchemy import not_, or_, func
from sqlalchemy.orm import Session

from app import schemas
from app.crud import candidate
from app.models import Application, Candidate, Vacancy


def create(session: Session, vacancy: schemas.VacancyCreate, user: schemas.User) -> Vacancy:
    db_vacancy = Vacancy(
        title=vacancy.title,
        grade=vacancy.grade,
        description=vacancy.description,
        # competencies=json.dumps(vacancy.competencies),
        competencies=json.dumps([competence.dict() for competence in vacancy.competencies]),
        user_id=user.id
    )

    session.add(db_vacancy)
    session.commit()
    session.refresh(db_vacancy)

    return db_vacancy


def get_all(
    session: Session,
    title: str | None = None,
    grade: str | None = None,
    competencies: str | None = None
) -> list[Vacancy]:
    query = session.query(Vacancy)

    if grade is not None:
        query = query.filter(Vacancy.grade == grade)
    if title is not None:
        query = query.filter(Vacancy.title.ilike(f"%{title}%"))

    if competencies is not None:
        competencies_list = [competence.strip(' ,\n').lower() for competence in competencies.split()]
        conditions = [Candidate.competencies.ilike(f"%{competence}%") for competence in competencies_list]
        query = query.filter(
            or_(*conditions)
        )

    return query.all()


def get_vacancy(session: Session, vacancy_id: int) -> (Vacancy, list[schemas.CandidateForVacancy]):
    db_vacancy = session.query(Vacancy).filter(Vacancy.id == vacancy_id).first()
    db_candidates = candidate.get_candidates_by_vacancy(session, db_vacancy)
    return db_vacancy, db_candidates
