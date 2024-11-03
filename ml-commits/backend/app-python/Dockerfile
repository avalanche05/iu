FROM python:3.12.6-bookworm

WORKDIR /app/

RUN mkdir -p /app/data

COPY ./requirements.txt /app/

RUN pip install -r requirements.txt

COPY ./app/ /app/app

CMD ["fastapi", "run", "--workers", "4", "--host", "0.0.0.0", "--port", "8000", "app/main.py"]