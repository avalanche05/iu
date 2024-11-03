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

@router.get("/code/")
def get_code(repo_url: str, contributor: str) -> dict:
    files = git_client.get_repo_files(repo_url)
    result = llm_client.get_code_summary(repo_url, contributor, data=files)
    return result

@router.get("/profile")
def get_profile(profile_nickname: str) -> dict:
    return result
