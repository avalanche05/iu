from app import models, schemas
from app.serializers.user import get_user


def get_vacancy(db_vacancy: models.Vacancy) -> schemas.Vacancy:
    return schemas.Vacancy(
        id=db_vacancy.id,
        position=db_vacancy.position,
        grade=db_vacancy.grade.lower(),
        speciality=db_vacancy.speciality,
        description=db_vacancy.description,
        team=db_vacancy.team,
        created_at=db_vacancy.created_at,
        city=db_vacancy.city,
        work_format=db_vacancy.work_format,
        skills=db_vacancy.skills,
        user=get_user(db_vacancy.user)
    )


def get_vacancies(db_vacancies: list[models.Vacancy]) -> list[schemas.Vacancy]:
    return [get_vacancy(db_vacancy) for db_vacancy in db_vacancies]
