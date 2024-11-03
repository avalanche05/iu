import json
import os

from fastapi import APIRouter

from app.schemas import ResumeProcess, FeedbackRequest, Feedback
from app.api.deps import S3ClientDep
from app.utils.s3 import get_file as s3_get_file

from app.core.autocomplete_answer import main as generate_feedback
from app.utils import vacancy_structure

router = APIRouter()


@router.post("/resume/process")
async def process_resume(resume_process: ResumeProcess, s3_client: S3ClientDep) -> dict:
    file_key = resume_process.file_key
    file_bytes = s3_get_file(s3_client, file_key)

    new_file_path = f"data/{file_key}"
    with open(new_file_path, "wb") as f:
        f.write(file_bytes)

    result = vacancy_structure.main(new_file_path)

    return result


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
