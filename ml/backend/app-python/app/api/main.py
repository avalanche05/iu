import json
import os

from fastapi import APIRouter

from app.schemas import ResumeProcess, ResumeProcessResponse, Candidate, FeedbackRequest, Feedback, Vacancy, \
    CandidateVacancy
from app.api.deps import S3ClientDep
from app.utils.resume_structure import main as file_to_json
from app.utils.s3 import get_file as s3_get_file

from app.core.autocomplete_answer import main as generate_feedback

router = APIRouter()


@router.post("/resume/process")
async def process_resume(resume_process: ResumeProcess, s3_client: S3ClientDep) -> ResumeProcessResponse:
    file_key = resume_process.file_key

    file_bytes = s3_get_file(s3_client, file_key)

    with open(f"data/{file_key}", "wb") as f:
        f.write(file_bytes)

    data = file_to_json(f"data/{file_key}")

    return ResumeProcessResponse(
        candidate=Candidate(
            nickname=data["nickname"],
            email=data["email"],
            github_url=data["github_url"],
            competencies=data["competencies"],
            experience_years=data["experience_years"],
            grade=data["grade"],
            summary=data["summary"],
            code_quality=data["code_quality"],
        )
    )


@router.post("/feedback/generate")
async def process_resume(feedback_request: FeedbackRequest) -> Feedback:
    message = generate_feedback(data={
        "target_action": feedback_request.action,
        "name": feedback_request.candidate.nickname,
        "position": feedback_request.vacancy.position,
        "summary": feedback_request.candidate.summary,
        "description": feedback_request.vacancy.description,
    })

    print(feedback_request.status)

    return Feedback(message=message)
