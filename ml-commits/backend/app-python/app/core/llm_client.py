import os
import random
import requests
import json

from pydantic import BaseModel
from typing import List, Dict
GIT_SERVER_URL = os.environ.get("GIT_SERVER_URL", "http://misis.tech:7001")

class Competency(BaseModel):
    name: str
    proficiency: float


class Commit(BaseModel):
    summary: str
    competencies: List[Competency]


class Code(BaseModel):
    summary: str
    competencies: List[Competency]
    code_quality: float


BATCHES_FOR_EXT_LIMIT = 1
KEY_MATCHES_LIMIT = 5
exts = [
    '.py',  # Python
    '.cpp', '.cxx', '.cc', '.c++',  # C++
    '.js',  # JavaScript
    '.java',  # Java
    '.c',  # C
    '.cs',  # C#
    '.php',  # PHP
    '.rb',  # Ruby
    '.swift',  # Swift
    '.go',  # Go
    '.rs',  # Rust
    '.ts',  # TypeScript
    '.kt',  # Kotlin
    '.pl',  # Perl
    '.r',  # R
    '.dart',  # Dart
    '.scala',  # Scala
    '.hs',  # Haskell
    '.lua',  # Lua
]


def preprocess_str(s: str):
    return s.strip().strip('(').strip(')').strip().strip("'").strip().strip('"').strip("'").replace("\n", '').replace('\\n', '').replace('\\', '')
class LlmRun:
    def __init__(self, url: str, system_promt: str = "You are a helpful assistant."):
        self.llm_url = url
        self.system_prompt = system_promt
        self.headers = {
            "Content-Type": "application/json"
        }

    def run(self, prompt, max_tokens=100, temperature=0.1, schema=None):
        data = {
            "prompt": [prompt],
            "apply_chat_template": True,
            "system_prompt": self.system_prompt,
            "max_tokens": max_tokens,
            "n": 1,
            "schema": schema,
            "temperature": temperature
        }

        response = requests.post(self.llm_url + '/generate', data=json.dumps(data), headers=self.headers)
        return response.text


url = "https://vk-devinsight-case-backup.olymp.innopolis.university"
llm = LlmRun(url=url)


def get_candidate(commits: list[dict]) -> dict:
    context = ""
    for commit in commits:
        context += f"Дата:{commit['date']}" + f"Коммит: {commit['message']}" + '\n'

    schema = Commit.schema()
    schema_json = json.dumps(schema, indent=2)
    raw = llm.run(f"""Мне нужно, используя данные коммитов из Context одного человека, сгенерировать один json со следующими полями: summary: str, competencies: name: str, proficiency: float
    summary - это кратко какой вклад был сделан кандидатом;
    competencies - это технологии, которые он использовал в своем проекте.
    Context: {context}
    Отвечай без объяснения. Мне нужен только json, никаких лишних символов. Штраф - 10000000000000$.
    """, max_tokens=500, temperature=0.5, schema=schema_json)
    t = json.loads(raw)
    return json.loads(t)


def get_code_summary(repo_url: str, contributor: str, data: dict) -> dict:
    runs = []
    files = ''
    real_keys = list(data.keys())
    random.shuffle(real_keys)
    for key in real_keys:
        key_match_cnt = 0
        if key in exts:
            if key_match_cnt >= KEY_MATCHES_LIMIT:
                break
            key_match_cnt += 1
            batches_count_for_ext = 0
            random.shuffle(data[key])
            for i, file_path in enumerate(data[key]):
                url = GIT_SERVER_URL+ '/code/'
                params = {
                    'repo_url': repo_url,
                    'contributor': contributor,
                    'file_path': file_path
                }

                response = requests.get(url, params=params)

                # Check if the request was successful
                if response.status_code == 200:
                    # Parse the JSON response
                    file = response.json()
                    if len(file.values()) > 0:
                        for str_code in file[key]:
                            files += str_code + '\n'
                else:
                    print(f'Failed to retrieve data: {response.status_code}')
                # files += '\n'
                if (len(files) > 10000) or (i == len(data[key]) - 1) or i >= 50:
                    batches_count_for_ext += 1
                    prompt = f"""Дай краткий анализ по написанному коду на языке {key}. Мне нужны поля summary - это кратко какой вклад был сделан кандидатом;
                    competencies - это технологии, которые он использовал в своем проекте в виде name, proficiency - от 0 до 1;
                    code_quality - дай оценку от 0 до 1 качество написанного кода.
                    Context: {files}.
                    Отвечай без объяснений. Дай ответ в формате json. Без лишних символов. Иначе штраф 1000000 долларов.
                    """
                    schema = Code.schema()
                    schema_json = json.dumps(schema, indent=2)
                    run = llm.run(prompt, max_tokens=500, temperature=0.3, schema=schema_json)
                    runs.append(run)
                    files = ''
                    break

    sumarries = ""
    competencies = ""
    code_quality = 0
    count = 0
    for run in runs:
        if len(run.strip()) != 0:
            try:
                candidate = json.loads(preprocess_str(run))
                sumarries += candidate['summary'] + ' '
                for comp in candidate['competencies']:
                    competencies += f"name: {comp['name']}; proficiency: {comp['proficiency']}" + ' '
                code_quality += candidate['code_quality']
                count += 1
            except Exception as e:
                print(e)
    print("smrs", sumarries)
    promt = f"""Дай харакетристику компетенции что умеет кандидат, используя данные о нем в Context.
    Context: {sumarries}
    Отвечай без объяснений. Пиши предложения, разделяй предложения точкой. Иначе штраф 10000000 долларов.
    """
    final_summary = llm.run(promt, max_tokens=350, temperature=0.3)

    promt = f"""Сделай суммаризацию по данным о компетенциям, где даны технологии и их качество. Мне нужно вывести в таком же формате, как я тебе даю.
    Context: {competencies}
    Отвечай без объяснений. Отвечай только в формате списка json. Иначе штраф 10000000 долларов.
    """
    final_competency = json.loads(preprocess_str(llm.run(promt, max_tokens=350, temperature=0.3)))

    return {'summary': preprocess_str(final_summary), 'competencies': final_competency,
            'code_quality': round(code_quality / count, 2) if count > 0 else 0}
