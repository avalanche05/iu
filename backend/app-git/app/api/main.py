import git
from git import Repo
import os

from fastapi import APIRouter, HTTPException


router = APIRouter()
REPO_DIR = "/home/ilinivan/repos"
@router.get("/commits/")
def get_commits(repo_url: str, contributor: str):
    repo_name = repo_url.split("/")[-1].split(".")[0]
    local_repo_path = os.path.join(REPO_DIR, repo_name)
    if not os.path.exists(local_repo_path):
        git.Repo.clone_from(repo_url, local_repo_path)
    try:
        repo = git.Repo(local_repo_path)
    except git.exc.InvalidGitRepositoryError:
        raise HTTPException(status_code=404, detail="Invalid Git repository")

    commits = list(repo.iter_commits())
    commits_by_author = {}

    for commit in commits:
        author = commit.author.name
        if author not in commits_by_author:
            commits_by_author[author] = []
        
        commits_by_author[author].append({
            'message': commit.message,
            'date': commit.authored_date
        })

    if contributor not in commits_by_author:
        raise HTTPException(status_code=404, detail="Contributor not found")

    return commits_by_author[contributor][:min(len(commits_by_author[contributor]), 200)]

@router.get("/files/")
def get_files(repo_url: str):
    repo_name = repo_url.split("/")[-1].split(".")[0]
    local_repo_path = os.path.join(REPO_DIR, repo_name)
    if not os.path.exists(local_repo_path):
        Repo.clone_from(repo_url, local_repo_path)

    files_by_ext = {}

    for root, dirs, files in os.walk(local_repo_path):
        for file in files:
            file_path = os.path.join(root, file)
            file_ext = os.path.splitext(file)[1]
            if file_ext not in files_by_ext:
                files_by_ext[file_ext] = []
            files_by_ext[file_ext].append(file_path)

    return files_by_ext

@router.get("/code/")
def get_contributor_code(repo_url: str, contributor: str, file_path: str):
    repo_name = repo_url.split("/")[-1].split(".")[0]
    local_repo_path = os.path.join(REPO_DIR, repo_name)
    if not os.path.exists(local_repo_path):
        Repo.clone_from(repo_url, local_repo_path)

    repo = Repo(local_repo_path)

    contributor_code = {}

    try:

        for commit, lines in repo.blame('HEAD', file_path):
            if commit.author.name == contributor:
                file = os.path.basename(file_path)
                file_ext = os.path.splitext(file)[1]
                if file_ext not in contributor_code:
                    contributor_code[file_ext] = []
                contributor_code[file_ext].extend(lines)
    except Exception as e:
        print(f"Error processing file {file_path}: {e}")

    return contributor_code