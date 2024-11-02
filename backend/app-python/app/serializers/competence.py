import json

from app import schemas
# from app.schemas import Competence as schemas.Competence


def get_competence(dict_competence: dict) -> schemas.Competence:
    return schemas.Competence(
        name=dict_competence.get("name"),
        proficiency=dict_competence.get("proficiency")
    )


def get_competencies(db_competence: str) -> list[schemas.Competence]:
    competencies = json.loads(db_competence)
    return [get_competence(competence) for competence in competencies]

