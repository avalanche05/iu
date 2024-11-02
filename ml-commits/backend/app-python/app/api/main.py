import json
import os

from fastapi import APIRouter
from app.core import git_client, llm_client


router = APIRouter()

@router.get("/commits/")
def get_commits(repo_url: str, contributor: str) -> dict:
    commits = git_client.get_commits(repo_url, contributor)
    candidate = llm_client.get_candidate(commits)
    return candidate