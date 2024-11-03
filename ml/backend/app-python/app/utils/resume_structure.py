import json
from pprint import pprint

from app.utils.extract_text_from_file import ReadResume
from app.utils.ollama_run import LlamaRun


def main(pdf_path: str):
    template = """Use the following pieces of context to expand vacancy description to fields in JSON-format: "title": string, "grade": string, "description": string, "competencies": [{"name": string, "proficiency": float between 0 and 1}].
    title - get vacancy title;
    grade - write only: 'Junior', 'Middle' or 'Senior';
    competencies - find key competencies/skills. Make it list of dicts with following content: "name": name of competence, "proficiency": float value of how well this competence should be known for this vacancy. It should have values between 0 and 1, where 0 is the lowest level of knowledge and 1 is the highest level of knowledge.
    Answer with only JSON-format text.
    Context:
    {context}

    Question: answer using language of original context"""

    

    reader = ReadResume(pdf_path)
    resume_text = reader.extract_text()

    model = LlamaRun(template=template,
                     ollama_url="https://useful-kite-settled.ngrok-free.app",
                     model_name="llama3.1:8b",
                     temperature=0)
    resume_structured = model.run(context=resume_text)

    data = json.loads(
        resume_structured.replace('json\n', "").replace("```", "").replace("\n", ""))
    return data


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