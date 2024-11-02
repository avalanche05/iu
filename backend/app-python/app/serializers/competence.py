import json

from app import schemas


def get_competence(dict_competence: dict) -> schemas.Competence:
    return schemas.Competence(
        name=dict_competence.get("name"),
        proficiency=dict_competence.get("proficiency")
    )


def get_competencies(db_competence: str) -> list[schemas.Competence]:
    competencies = json.loads(db_competence)
    return [get_competence(competence) for competence in competencies]


def get_competencies_from_db(db_competencies: list[dict]) -> list[schemas.Competence]:
    return [get_competence(db_competence) for db_competence in db_competencies]
