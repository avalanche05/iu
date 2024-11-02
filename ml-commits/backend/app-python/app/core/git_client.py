import requests
class GitRepo:
    def __init__(self, url: str):
        self.server_url = url
        self.headers = {
            "Content-Type": "application/json"
        }
    def run(self, repo_url: str, contributor: str) -> list[dict]:
        params = {
            "repo_url": repo_url,
            "contributor": contributor,
        }
        response = requests.get(self.server_url + f'/commits/', params=params)
        
        return response.json()
        


git_repo = GitRepo(url="http://misis.tech:8000")

def get_commits(repo_url: str, contributor: str) -> list[dict]:

    return git_repo.run(repo_url, contributor)