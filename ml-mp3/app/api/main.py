import os
import threading
import copy
import os

from fastapi import APIRouter, HTTPException

from app.core.ml import get_mp3_analyze
from app.utils.s3 import get_file as s3_get_file
from app.deps import S3ClientDep, StorageDep

router = APIRouter()
class ResumeProcessorThread(threading.Thread):
    def __init__(
            self,
            session_id: str,
            mp3_file_key: str,
            s3_client,
            position: str,
            compitencies: list[dict],
    ):
        threading.Thread.__init__(self)
        self.session_id = session_id
        self.lock = threading.RLock()
        self._result = None
        self._s3_client = s3_client
        self._mp3_file_key = mp3_file_key
        self._position = position
        self._compitencies = compitencies
    def run(self):
        file_key = self._mp3_file_key
        file_name = self._mp3_file_key.split("~!~")[-1]
        file_bytes = s3_get_file(self._s3_client, file_key)

        new_file_path = f"data/{file_key}"
        with open(new_file_path, "wb") as f:
            f.write(file_bytes)
        result = get_mp3_analyze(new_file_path, self._position, self._compitencies)
        with self.lock:
            self._result = {
                "file_name": file_name,
                "is_success": True,
                "interview": {
                    "competencies": result["competencies"],
                    "summary": result["summary"],
                    },
            }


@router.post("/interview/analyze/{session_id}")
async def analyze_interwiew(
        s3_client: S3ClientDep,
        storage: StorageDep,
        session_id: str,
        data: dict,
) -> dict:
    competencies = data["competencies"]
    resume_processor = ResumeProcessorThread(
        session_id=session_id,
        mp3_file_key=data["file_key"],
        s3_client=s3_client,
        position=data["position"],
        compitencies=competencies,
    )

    resume_processor.start()
    storage[session_id] = resume_processor
    return {
        "is_finished": False,
        "interview": None,
    }


@router.get("/interview/analyze/{session_id}")
async def get_interview_process_session(storage: StorageDep, session_id: str):
    if session_id not in storage:
        raise HTTPException(
            status_code=404, detail=f"Session with id: {session_id} not found"
        )
    processor_thread = storage[session_id]
    
    if processor_thread._result:
        return {
            "is_finished": True,
            "interview": processor_thread._result["interview"],
        }
    if not processor_thread.is_alive():
        return {
            "is_finished": True,
            "interview": None,
        }
    return {
        "is_finished": False,
        "interview": None,
    }