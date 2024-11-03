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
            mp3_file_key: list[str],
            s3_client,
            position: str,
    ):
        threading.Thread.__init__(self)
        self.session_id = session_id
        self.lock = threading.RLock()
        self._result = None
        self._s3_client = s3_client
        self._mp3_file_key = mp3_file_key
        self._position = position
    def run(self):
        file_key = self._mp3_file_key
        file_name = self._mp3_file_key.split("~!~")[-1]
        file_bytes = s3_get_file(self._s3_client, file_key)

        new_file_path = f"data/{file_key}"
        with open(new_file_path, "wb") as f:
            f.write(file_bytes)
        result = get_mp3_analyze(new_file_path, "middle")
        with self.lock:
            self._result = {
                "file_name": file_name,
                "is_success": True,
                "competencies": result,
            }
            print(self._result)


@router.post("/interview/analyze/{session_id}")
async def analyze_interwiew(
        s3_client: S3ClientDep,
        storage: StorageDep,
        session_id: str,
        data: dict,
) -> dict:
    resume_processor = ResumeProcessorThread(
        session_id=session_id,
        mp3_file_key=data["file_key"],
        s3_client=s3_client,
        position=data["position"],
    )

    resume_processor.start()
    storage[session_id] = resume_processor
    return {
        "is_finished": False,
        "competencies": [],
    }


# @router.get("/{session_id}")
# async def get_resume_process_session(storage: StorageDep, db_user: CurrentUser, session_id: str):
#     if session_id not in storage:
#         raise HTTPException(
#             status_code=404, detail=f"Session with id: {session_id} not found"
#         )
#     processor_thread = storage[session_id]
#     processed_files = []
#     all_files = []
#     with processor_thread.lock:
#         processed_files = copy.copy(processor_thread._processed_files)
#         all_files = copy.copy(processor_thread.all_files)
#     is_active = processor_thread.is_alive()

#     processing = []
#     success = []
#     error = []

#     for file in all_files:
#         if file in processed_files:
#             file_data = processed_files[file]
#             if file_data["is_success"]:
#                 success.append(
#                     FileResult(
#                         file_name=file_data["file_name"],
#                         vacancy=file_data["vacancy"],
#                     )
#                 )
#             else:
#                 error.append(
#                     FileResult(
#                         file_name=file_data["file_name"],
#                         message=file_data["reason"],
#                     )
#                 )
#         else:
#             processing.append(FileResult(file_name=file))

#     return ResumeProcessSession(
#         session_id=session_id,
#         is_finished=not is_active,
#         processing=processing,
#         success=success,
#         error=error,
#     )