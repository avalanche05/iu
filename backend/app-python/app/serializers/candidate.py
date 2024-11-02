from app import models, schemas
from app.serializers import competence, folder, interview


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
        technical_interview_result=None if db_candidate.interview is None else interview.get_interview(db_candidate.interview)
    )


def get_candidates(db_candidates) -> list[schemas.Candidate]:
    return [get_candidate(db_candidate) for db_candidate in db_candidates]
