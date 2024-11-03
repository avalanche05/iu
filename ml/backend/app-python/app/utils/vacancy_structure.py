import json
from pydantic import BaseModel
from typing import List
from pprint import pprint

from app.utils.extract_text_from_file import ReadResume
from app.utils.ollama_run import LlamaRun


class Competency(BaseModel):
    name: str
    proficiency: float


class Vacancy(BaseModel):
    title: str
    description: str
    grade: str
    competencies: List[Competency]

def preprocess_str(s: str):
    return s.strip().strip('(').strip(')').strip().strip("'").strip().strip('"').strip("'").replace("\n", '').replace('\\n', '').replace('\\', '')

def main(pdf_path: str):
    reader = ReadResume(pdf_path)
    resume_text = reader.extract_text()

    prompt = f"""Используй текст из context для формирования json для вакансии.
    title - название вакансии; description - краткое описание вакансии, напиши самое важное в двух предложениях; grade - junior, middle или senior; competencies - это технологии, которые нужны для этой вакансии, где name - название, proficiency - оценка умения от 0 до 1.
    Context: {resume_text}
    Отвечай без объяснений.
    """
    model = LlamaRun(
        url="https://vk-devinsight-case.olymp.innopolis.university"
    )
    schema = Vacancy.schema()
    schema_json = json.dumps(schema, indent=2)
    resume_structured = model.run(prompt=prompt, max_tokens=500,
                                  temperature=0.5, schema=schema_json)

    resume_structured = preprocess_str(resume_structured)
    
    data = json.loads(resume_structured)
    return data


# if __name__ == "__main__":
#     result = main(pdf_path="C:/Users/User/Downloads/MIddle Python Developer.pdf")
#     print(result)

# from botocore.client import BaseClient
# def get_file(s3_client: BaseClient, file_key: str) -> bytes:
#     response = s3_client.get_object(Bucket="hack-s3", Key=file_key)
#     return response['Body'].read()

# def t():
#     s3_session = boto3.session.Session()
#     s3_client = s3_session.client(
#         service_name='s3',
#         endpoint_url='https://storage.yandexcloud.net',
#     )

#     file_bytes = get_file(s3_client, "28cf65dc-213f-4ef2-9f20-1bea2d563384~!~Akhundov Damat.pdf")

#     with open("test.pdf", "wb") as f:   
#         f.write(file_bytes)

#     pprint(main("test.pdf"))

# t()
