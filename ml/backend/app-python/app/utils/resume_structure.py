import json
from pprint import pprint

from app.utils.extract_text_from_file import ReadResume
from app.utils.ollama_run import LlamaRun


def main(pdf_path: str):
    template = """Use the following pieces of context to expand resume to fields in JSON-format:"name": string, "phone": string, "email": string, "contacts": string, "city":string, "work_format": string, "skills": string, "experience": float, "position": string, "grade": string, "speciality": string, "education":string, "summary": string.
    experience - get number how long he woked in years, if now - 2024
    summary - summarize work exeperience in two sentences;
    work_format - 'ONLINE' or 'OFFLINE';
    grade - write only: 'Junior', 'Middle' or 'Senior'.
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