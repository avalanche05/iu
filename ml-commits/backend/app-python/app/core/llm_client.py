import requests
import json
class LlmRun:
    def __init__(self, url: str, system_promt: str="You are a helpful assistant."):
        self.llm_url = url
        self.system_prompt = system_promt
        self.headers = {
            "Content-Type": "application/json"
        }
    def run(self, prompt, max_tokens=100, temperature=0.1):
        data = {
        "prompt": [prompt],
        "apply_chat_template": True,
        "system_prompt": self.system_prompt,
        "max_tokens": max_tokens,
        "n": 1,
        "temperature": temperature
        }
        
        
        response = requests.post(self.llm_url + '/generate', data=json.dumps(data), headers=self.headers)
        return response.text


url = "https://vk-devinsight-case.olymp.innopolis.university"
llm = LlmRun(url=url)

def get_candidate(commits: list[dict]) -> dict:

    context = ""
    for commit in commits:
        context += f"Дата:{commit['date']}" + f"Коммит: {commit['message']}" + '\n'

    raw = llm.run(f"""Мне нужно, используя данные коммитов из Context одного человека, сгенерировать один json со следующими полями: summary: str, competencies: name: str, proficiency: float
    summary - это кратко какой вклад был сделан кандидатом;
    competencies - это технологии, которые он использовал в своем проекте.
    Context: {context}
    Отвечай без объяснения. Мне нужен только json, никаких лишних символов. Штраф - 10000000000000$.
    """, max_tokens=500, temperature=0.5)
    t = json.loads(raw)
    return json.loads(t)