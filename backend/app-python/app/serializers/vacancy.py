from app import models, schemas
from app.serializers import competence


def get_vacancy(db_vacancy: models.Vacancy) -> schemas.Vacancy:
    return schemas.Vacancy(
        id=db_vacancy.id,
        title=db_vacancy.title,
        grade=db_vacancy.grade.lower(),
        description=db_vacancy.description,
        competencies=competence.get_competencies(db_vacancy.competencies)
    )


def get_vacancies(db_vacancies: list[models.Vacancy]) -> list[schemas.Vacancy]:
    return [get_vacancy(db_vacancy) for db_vacancy in db_vacancies]
