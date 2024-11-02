import copy
import os
import queue
import threading
import time
from uuid import uuid4

import boto3
import requests
from fastapi import APIRouter, File, HTTPException, UploadFile

from app import crud, serializers, utils
from app.api.deps import S3ClientDep, SessionDep, StorageDep, CurrentUser
from app.crud import auth
from app.models.application import Application
from app.models.candidate import Candidate
from app.schemas import FileResult, ResumeProcessSession, VoiceProcessSession
from app.serializers.user import get_user

router = APIRouter()


class ResumeProcessorThread(threading.Thread):
    def __init__(
        self,
        session_id: str,
        files: list[str],
        db_session,
        s3_client,
        vacancy_id: int | None = None,
    ):
        threading.Thread.__init__(self)
        self.session_id = session_id
        self.files = files
        self.lock = threading.RLock()
        self._files_queue = queue.Queue()
        self._processed_files = {}
        self._db_session = db_session
        self.all_files = copy.copy(files)
        self._s3_client = s3_client
        self.vacancy_id = vacancy_id

        for file_key in files:
            self._files_queue.put(file_key)

    def run(self):
        while not self._files_queue.empty():
            file_key = self._files_queue.get()
            response = requests.post(
                f"{os.environ.get('ML_RESUME_HOST', 'http://localhost')}:5000/resume/process",
                json={
                    "file_key": file_key,
                },
            )
            file_name = file_key.split("~!~")[-1]
            if not response.ok:
                self._processed_files[file_key] = {
                    "file_name": file_name,
                    "is_success": False,
                    "reason": response.text,
                }
                continue
            candidate = response.json()["candidate"]
            with self.lock:

                resume_link = self._s3_client.generate_presigned_url(
                    "get_object",
                    Params={"Bucket": "hack-s3", "Key": file_key},
                    ExpiresIn=7 * 86400,
                )

                db_candidate = crud.candidate.create(
                    self._db_session,
                    candidate,
                    resume_link=resume_link,
                    is_cold=bool(self.vacancy_id is None),
                )

                if self.vacancy_id:
                    crud.application.create_or_update(
                        self._db_session,
                        Application(
                            vacancy_id=self.vacancy_id,
                            candidate_id=db_candidate.id,
                            status="pending",
                        ),
                    )

            with self.lock:
                self._processed_files[file_key] = {
                    "file_name": file_name,
                    "is_success": True,
                    "candidate": serializers.get_candidate(db_candidate),
                }


@router.post("")
async def upload_resume(
    db_session: SessionDep,
    s3_client: S3ClientDep,
    storage: StorageDep,
    db_user: CurrentUser,
    files: list[UploadFile] = File(...),
    vacancy_id: int | None = None,
) -> ResumeProcessSession:
    succes_files = []
    error_files = []
    for file in files:
        try:
            utils.s3.validate_fastapi_file(file)
            file_key = str(uuid4()) + "~!~" + file.filename
            file_content = await file.read()
            utils.s3.upload_file(
                s3_client=s3_client,
                file_key=file_key,
                file_content=file_content,
                file_type=file.content_type,
            )
            succes_files.append(file_key)
        except Exception as e:
            error_files.append({"file_name": file.filename, "reason": str(e)})

    session_id = str(uuid4())
    resume_processor = ResumeProcessorThread(
        session_id=session_id,
        files=succes_files,
        db_session=db_session,
        s3_client=s3_client,
        vacancy_id=vacancy_id,
    )

    resume_processor.start()
    storage[session_id] = resume_processor

    return ResumeProcessSession(
        session_id=session_id,
        is_finished=False,
        processing=[
            FileResult(file_name=file_key.split("~!~")[-1]) for file_key in succes_files
        ],
        success=[],
        error=[
            FileResult(file_name=file["file_name"], message=file["reason"])
            for file in error_files
        ],
    )


@router.get("/{session_id}")
async def get_resume_process_session(storage: StorageDep, db_user: CurrentUser, session_id: str):
    if session_id not in storage:
        raise HTTPException(
            status_code=404, detail=f"Session with id: {session_id} not found"
        )
    processor_thread = storage[session_id]
    processed_files = []
    all_files = []
    with processor_thread.lock:
        processed_files = copy.copy(processor_thread._processed_files)
        all_files = copy.copy(processor_thread.all_files)
    is_active = processor_thread.is_alive()

    processing = []
    success = []
    error = []

    for file in all_files:
        if file in processed_files:
            file_data = processed_files[file]
            if file_data["is_success"]:
                success.append(
                    FileResult(
                        file_name=file_data["file_name"],
                        candidate=file_data["candidate"],
                    )
                )
            else:
                error.append(
                    FileResult(
                        file_name=file_data["file_name"],
                        message=file_data["reason"],
                    )
                )
        else:
            processing.append(FileResult(file_name=file))

    return ResumeProcessSession(
        session_id=session_id,
        is_finished=not is_active,
        processing=processing,
        success=success,
        error=error,
    )




@router.post("/voice")
async def upload_resume_voice(
    s3_client: S3ClientDep,
    db_user: CurrentUser,
    file: UploadFile = File(...),
) -> VoiceProcessSession:
    assert str(file.filename).endswith(".mp3")
    file_key = str(uuid4()) + "~!~" + file.filename
    file_content = await file.read()
    utils.s3.upload_file(
        s3_client=s3_client,
        file_key=file_key,
        file_content=file_content,
        file_type=file.content_type,
    )

    session_id = str(uuid4())

    response = requests.post("http://51.250.25.30:5001/interview/analyze/" + session_id,
                  json={
                      "file_key": file_key,
                      "position": "сотрудник",
                  })
    
    response.raise_for_status()
    data = response.json()
    return VoiceProcessSession(
        session_id=session_id,
        is_finished=data["is_finished"],
        message=data["message"],
    )


@router.get("/voice/{session_id}")
async def voice_session(
    session_id: str,
    db_user: CurrentUser,
) -> VoiceProcessSession:
    response = requests.get("http://51.250.25.30:5001/interview/analyze/" + session_id)
    
    response.raise_for_status()
    data = response.json()
    return VoiceProcessSession(
        session_id=session_id,
        is_finished=data["is_finished"],
        message=data["message"],
    )