import json
import math
from sqlalchemy import func, and_, or_, select
from sqlalchemy.orm import Session

from app import schemas, serializers
from app.models import Candidate, Vacancy, FolderCandidate
from app.utils.candidate_metrics import calculate_compliance_metric_percents


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
        query = query.join(FolderCandidate, Candidate.id == FolderCandidate.c.candidate_id) \
            .filter(FolderCandidate.c.folder_id == folder_id)

    if competencies is not None:
        competencies_list = [competence.strip(' ,\n').lower() for competence in competencies.split()]
        conditions = [Candidate.competencies.ilike(f"%{competence}%") for competence in competencies_list]
        query = query.filter(
            or_(*conditions)
        )

    return query.all()


def create(
        session: Session, candidate: schemas.CandidateCreate
) -> Candidate:
    db_candidate = Candidate(
        nickname=candidate.nickname,
        email=candidate.email,
        github_url=candidate.github_url,
        experience_years=candidate.experience_years,
        grade=candidate.grade,
        summary=candidate.summary,
        code_quality=candidate.code_quality,
        competencies=json.dumps([competence.dict() for competence in candidate.competencies]),
        metrics=json.dumps(serializers.convert_metrics_to_dict(candidate.metrics)),
        code_quality_reason=candidate.code_quality_reason
    )
    session.add(db_candidate)
    session.commit()
    session.refresh(db_candidate)
    return db_candidate


def create_from_link(session: Session, candidate: schemas.CandidateCreateLink):
    return {"message": "i love you"}
    db_candidate = Candidate(
        nickname=candidate.nickname,
        email=candidate.email,
        github_url=candidate.github_url,
        experience_years=candidate.experience_years,
        grade=candidate.grade,
        summary=candidate.summary,
        code_quality=candidate.code_quality,
        competencies=json.dumps([competence.dict() for competence in candidate.competencies]),
        metrics=json.dumps(serializers.convert_metrics_to_dict(candidate.metrics)),
        code_quality_reason=candidate.code_quality_reason
    )
    session.add(db_candidate)
    session.commit()
    session.refresh(db_candidate)
    return db_candidate


def get_candidate(session: Session, candidate_id: int) -> Candidate:
    return session.query(Candidate).filter(Candidate.id == candidate_id).first()


def get_candidates_by_vacancy(session: Session, vacancy: Vacancy) -> list[schemas.CandidateForVacancy]:
    query = session.query(Candidate).order_by(Candidate.experience_years)

    db_candidates = query.all()

    candidates = sorted([serializers.get_candidate_for_vacancy(db_candidate,
                                                               calculate_compliance_metric_percents(
                                                                   db_candidate.competencies,
                                                                   vacancy.competencies))
                         for db_candidate in db_candidates], key=lambda x: x.compliance_percent, reverse=True)
    return candidates
