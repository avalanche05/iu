from app import models, schemas
from app.serializers import competence, folder, interview, metric


def get_candidate(db_candidate: models.Candidate) -> schemas.Candidate:
    return schemas.Candidate(
        id=db_candidate.id,
        nickname=db_candidate.nickname,
        email=db_candidate.email,
        github_url=db_candidate.github_url,
        grade=db_candidate.grade.lower(),
        experience_years=db_candidate.experience_years,
        summary=db_candidate.summary,
        code_quality=db_candidate.code_quality,
        competencies=competence.get_competencies(db_candidate.competencies),
        folders=folder.get_folders(db_candidate.folders),
        technical_interview_result=None if db_candidate.interview is None else interview.get_interview(db_candidate.interview),
        metrics=metric.get_metric(db_candidate.metrics)
    )


def get_candidates(db_candidates: list[models.Candidate]) -> list[schemas.Candidate]:
    return [get_candidate(db_candidate) for db_candidate in db_candidates]


def get_candidate_for_vacancy(db_candidate_for_vacancy: models.Candidate,
                              compliance_percent: float) -> schemas.CandidateForVacancy:
    return schemas.CandidateForVacancy(
        id=db_candidate_for_vacancy.id,
        nickname=db_candidate_for_vacancy.nickname,
        email=db_candidate_for_vacancy.email,
        github_url=db_candidate_for_vacancy.github_url,
        grade=db_candidate_for_vacancy.grade.lower(),
        experience_years=db_candidate_for_vacancy.experience_years,
        summary=db_candidate_for_vacancy.summary,
        code_quality=db_candidate_for_vacancy.code_quality,
        competencies=competence.get_competencies(db_candidate_for_vacancy.competencies),
        folders=folder.get_folders(db_candidate_for_vacancy.folders),
        technical_interview_result=None if db_candidate_for_vacancy.interview is None else interview.get_interview(
            db_candidate_for_vacancy.interview),
        compliance_percent=compliance_percent,
        metrics=metric.get_metric(db_candidate_for_vacancy.metrics)
    )


def get_candidates_for_vacancy(db_candidates_for_vacancy) -> list[schemas.Candidate]:
    return [get_candidate(db_candidate_for_vacancy) for db_candidate_for_vacancy in db_candidates_for_vacancy]
