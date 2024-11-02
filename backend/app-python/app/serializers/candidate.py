from app import models, schemas
from app.serializers import folder


def get_candidate(db_candidate: models.Candidate) -> schemas.Candidate:
    return schemas.Candidate(
        id=db_candidate.id,
        name=db_candidate.name,
        phone=db_candidate.phone,
        email=db_candidate.email,
        contacts=db_candidate.contacts,
        skills=db_candidate.skills,
        experience=db_candidate.experience,
        position=db_candidate.position,
        grade=db_candidate.grade.lower(),
        speciality=db_candidate.speciality,
        education=db_candidate.education,
        summary=db_candidate.summary,
        is_cold=db_candidate.is_cold,
        resume_link=db_candidate.resume_link,
        city=db_candidate.city,
        work_format=db_candidate.work_format,
        folders=folder.get_folders(db_candidate.folders),
    )


def get_candidates(db_candidates) -> list[schemas.Candidate]:
    return [get_candidate(db_candidate) for db_candidate in db_candidates]
