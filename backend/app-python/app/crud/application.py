from sqlalchemy.orm import Session

from app import schemas
from app.models import Application, Candidate, Vacancy


def create_or_update(
    session: Session, application: schemas.ApplicationCreate
) -> Application:
    db_appication = (
        session.query(Application)
        .filter(Application.candidate_id == application.candidate_id)
        .first()
    )
    if db_appication is None:
        db_appication = Application(
            candidate_id=application.candidate_id,
            vacancy_id=application.vacancy_id,
            status="pending",
        )
    else:
        db_appication.candidate_id = application.candidate_id
        db_appication.vacancy_id = application.vacancy_id
        db_appication.status = "pending"
    session.add(db_appication)
    session.commit()
    session.refresh(db_appication)
    return db_appication


def update_status(
    session: Session, application_id: int, status: schemas.ApplicationStatusUpdate
) -> Application:
    db_application = session.query(Application).filter_by(id=application_id).first()

    if db_application is None:
        raise ValueError(f"Application with id: {application_id} not found")

    db_application.status = status.status
    session.add(db_application)
    session.commit()
    session.refresh(db_application)
    return db_application


def get_all(
    session: Session,
    position: str | None = None,
    grade: str | None = None,
    speciality: str | None = None,
    vacancy_id: int | None = None,
    status: str | None = None,
) -> list[Application]:
    query = session.query(Application).join(Application.candidate)

    if position is not None:
        query = query.filter(Application.candidate.has(Candidate.position == position))
    if grade is not None:
        query = query.filter(Application.candidate.has(Candidate.grade == grade))
    if speciality is not None:
        query = query.filter(
            Application.candidate.has(Candidate.speciality == speciality)
        )
    if vacancy_id is not None:
        query = query.filter(Application.vacancy_id == vacancy_id)
    if status is not None:
        query = query.filter(Application.status == status)


    return query.all()


def get_by_candidate_and_vaccancy(session: Session, candidate_id: int, vacancy_id: int) -> Application:
    db_application = session.query(Application).filter_by(candidate_id=candidate_id, vacancy_id=vacancy_id).first()
    return db_application