from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.models import Candidate


def get_all(
    session: Session,
    position: str | None = None,
    grade: str | None = None,
    speciality: str | None = None,
    isCold: bool | None = None,
    city: str | None = None,
    work_format: str | None = None,
    skills: str | None = None
) -> list[Candidate]:
    query = session.query(Candidate)

    if position is not None:
        query = query.filter(Candidate.position.ilike(f"%{position}%"))
    if grade is not None:
        query = query.filter(Candidate.grade == grade)
    if speciality is not None:
        query = query.filter(Candidate.position.ilike(f"%{speciality}%"))
    if isCold is not None:
        query = query.filter(Candidate.is_cold == isCold)
    if city is not None:
        query = query.filter(Candidate.position.ilike(f"%{city}%"))
    if work_format is not None:
        query = query.filter(Candidate.work_format == work_format)
    if skills is not None:
        skills_list = skills.split()
        query = query.filter(
            or_(
                *[
                    func.array_position(Candidate.skills, term).isnot(None)
                    for term in skills_list
                ]
            )
        )

    return query.all()


def create(
    session: Session, candidate: dict, resume_link: str, is_cold: bool = True
) -> Candidate:
    db_candidate = Candidate(
        name=candidate["name"],
        phone=candidate["phone"],
        email=candidate["email"],
        contacts=candidate["contacts"],
        skills=[skill.lower().strip() for skill in candidate["skills"]],
        experience=candidate["experience"],
        position=candidate["position"],
        grade=candidate["grade"],
        speciality=candidate["speciality"],
        education=candidate["education"],
        summary=candidate["summary"],
        is_cold=is_cold,
        resume_link=resume_link,
        city=candidate["city"],
        work_format=candidate["work_format"],
    )
    session.add(db_candidate)
    session.commit()
    session.refresh(db_candidate)
    return db_candidate


def get_candidate(session: Session, candidate_id: int) -> Candidate:
    return session.query(Candidate).filter(Candidate.id == candidate_id).first()