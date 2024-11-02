import json
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app import schemas
from app.models import Candidate, Vacancy, FolderCandidate


def get_all(
    session: Session,
    grade: str | None = None,
    nickname: str | None = None,
    competencies: str | None = None,
    experience: int | None = None,
    folder_id: int | None = None,
) -> list[Candidate]:
    query = session.query(Candidate)

    if nickname is not None:
        query = query.filter(Candidate.nickname.ilike(f"%{nickname}%"))
    if grade is not None:
        query = query.filter(Candidate.grade == grade)
    if experience is not None:
        query = query.filter(Candidate.experience_years >= experience)
    if folder_id is not None:
        query = query.join(FolderCandidate, Candidate.id == FolderCandidate.c.candidate_id)\
            .filter(FolderCandidate.c.folder_id == folder_id)

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


def create(
    session: Session, candidate: schemas.Candidate
) -> Candidate:
    db_candidate = Candidate(
        name=candidate.name,
        phone=candidate.phone,
        email=candidate.email,
        experience_years=candidate.experience_years,
        grade=candidate.grade,
        summary=candidate.summary,
        code_quality=candidate.code_quality,
        competencies=json.dumps(candidate.competencies)
    )
    session.add(db_candidate)
    session.commit()
    session.refresh(db_candidate)
    return db_candidate


def get_candidate(session: Session, candidate_id: int) -> Candidate:
    return session.query(Candidate).filter(Candidate.id == candidate_id).first()


def get_candidates_by_vacancy(session: Session, vacancy: Vacancy) -> list[Candidate]:
    query = session.query(Candidate).order_by(Candidate.experience_years)

    return query.all()
