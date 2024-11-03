import json
import math
from sqlalchemy import func, and_, or_, select
from sqlalchemy.orm import Session

from app import schemas, serializers
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
        competencies=json.dumps([competence.dict() for competence in candidate.competencies])
    )
    session.add(db_candidate)
    session.commit()
    session.refresh(db_candidate)
    return db_candidate


def get_candidate(session: Session, candidate_id: int) -> Candidate:
    return session.query(Candidate).filter(Candidate.id == candidate_id).first()


def get_competencies_dict(competencies: list[dict]) -> dict:
    competencies_dict = {}
    for competence in competencies:
        competencies_dict[competence.get("name")] = competence.get("proficiency")

    return competencies_dict


def transfer_to_percents(normed_sq_root_diff: float, n: int) -> float:
    return (1 - normed_sq_root_diff / n) * 100


def calculate_compliance_metric(candidate_competencies: list[dict], vacancy_competencies: list[dict]) -> float:
    candidate_competencies_dict = get_competencies_dict(candidate_competencies)
    normed_sq_root_diff = 0

    for vacancy_competence in vacancy_competencies:
        vacancy_competence_name, vacancy_competence_proficiency = \
            vacancy_competence.get("name"), vacancy_competence.get("proficiency")

        candidate_competence_proficiency = 0
        if vacancy_competence_name in candidate_competencies_dict:
            candidate_competence_proficiency = candidate_competencies_dict.get(vacancy_competence_name)

        normed_sq_root_diff += abs(vacancy_competence_proficiency - candidate_competence_proficiency)

    return normed_sq_root_diff / len(vacancy_competencies)


def calculate_compliance_metric_percents(candidate_competencies_str: str, vacancy_competencies_str: str) -> float:
    try:
        candidate_competencies = json.loads(candidate_competencies_str)
        vacancy_competencies = json.loads(vacancy_competencies_str)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON input: {e}")

    normed_sq_root_diff = calculate_compliance_metric(candidate_competencies, vacancy_competencies)
    return transfer_to_percents(normed_sq_root_diff, len(vacancy_competencies))


def get_candidates_by_vacancy(session: Session, vacancy: Vacancy) -> list[schemas.CandidateForVacancy]:
    query = session.query(Candidate).order_by(Candidate.experience_years)

    db_candidates = query.all()

    candidates = sorted([serializers.get_candidate_for_vacancy(db_candidate,
                                                               calculate_compliance_metric_percents(
                                                                   db_candidate.competencies,
                                                                   vacancy.competencies))
                         for db_candidate in db_candidates], key=lambda x: x.compliance_percent, reverse=True)
    return candidates
