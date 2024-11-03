from app import models, schemas
from app.serializers.competence import get_competencies


def get_interview(db_interview: models.Interview) -> schemas.Interview:
    return schemas.Interview(
        id=db_interview.id,
        summary=db_interview.summary,
        competencies=get_competencies(db_interview.competencies)
    )


def get_interviews(db_interviews: list[models.Interview]) -> list[schemas.Interview]:
    return [get_interview(db_interview) for db_interview in db_interviews]
