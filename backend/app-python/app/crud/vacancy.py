import json
from sqlalchemy import not_, or_, func
from sqlalchemy.orm import Session

from app import schemas
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
        competencies_list = [competence.strip() for competence in competencies.split()]
        # query = query.filter(
        #     or_(
        #         *[
        #             func.array_position(Vacancy.skills, term).isnot(None)
        #             for term in competencies_list
        #         ]
        #     )
        # )

    return query.all()


def get_vacancy(session: Session, vacancy_id: int) -> Vacancy:
    query = session.query(Vacancy).filter(Vacancy.id == vacancy_id)
    return query.first()
