import requests
import os
import requests

GIT_SERVER_URL = os.environ.get("GIT_SERVER_URL", "http://misis.tech:7001")
class GitRepo:
    def __init__(self, url: str):
        self.server_url = url
        self.headers = {
            "Content-Type": "application/json"
        }
    def commits(self, repo_url: str, contributor: str) -> list[dict]:
        params = {
            "repo_url": repo_url,
            "contributor": contributor,
        }
        response = requests.get(self.server_url + f'/commits/', params=params)
        
        return response.json()

    def files(self, repo_url: str) -> list[dict]:
        params = {
            "repo_url": repo_url
        }
        response = requests.get(self.server_url + f'/files/', params=params)
        
        return response.json()
        



git_repo = GitRepo(url=GIT_SERVER_URL)


def get_commits(repo_url: str, contributor: str) -> list[dict]:

    return git_repo.commits(repo_url, contributor)

def get_repo_files(repo_url: str) -> list[dict]:
    
    return git_repo.files(repo_url)