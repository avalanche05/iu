from sqlalchemy import not_, or_, func
from sqlalchemy.orm import Session

from app import schemas
from app.models import Application, Candidate, Vacancy


def create(session: Session, vacancy: schemas.VacancyCreate, user: schemas.User) -> Vacancy:
    db_vacancy = Vacancy(
        position=vacancy.position,
        grade=vacancy.grade,
        speciality=vacancy.speciality,
        description=vacancy.description,
        team=vacancy.team,
        city=vacancy.city,
        work_format=vacancy.work_format,
        skills=[skill.lower().strip() for skill in vacancy.skills],
        user_id=user.id
    )

    session.add(db_vacancy)
    session.commit()
    session.refresh(db_vacancy)

    return db_vacancy


def get_all(
    session: Session,
    position: str | None = None,
    grade: str | None = None,
    speciality: str | None = None,
    city: str | None = None,
    work_format: str | None = None,
    skills: str | None = None,
) -> list[Vacancy]:
    query = session.query(Vacancy)

    if position is not None:
        query = query.filter(Vacancy.position.ilike(f"%{position}%"))
    if grade is not None:
        query = query.filter(Vacancy.grade == grade)
    if speciality is not None:
        query = query.filter(Vacancy.position.ilike(f"%{speciality}%"))
    if city is not None:
        query = query.filter(Vacancy.position.ilike(f"%{city}%"))
    if work_format is not None:
        query = query.filter(Vacancy.work_format == work_format)

    if skills is not None:
        skills_list = [skill.strip() for skill in skills.split()]
        query = query.filter(
            or_(
                *[
                    func.array_position(Vacancy.skills, term).isnot(None)
                    for term in skills_list
                ]
            )
        )

    return query.all()


def get_vacancy_cold_candidates(session: Session, vacancy_id: int) -> list[Candidate]:
    query = session.query(Candidate).filter(
        or_(
            Candidate.is_cold == True,
            not_(Candidate.applications.any(Application.vacancy_id == vacancy_id)),
        )
    )
    return query.all()


def get_vacancy(session: Session, vacancy_id: int) -> Vacancy:
    query = session.query(Vacancy).filter(Vacancy.id == vacancy_id)
    return query.first()