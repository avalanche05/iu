FROM python:3.12.6-bookworm

WORKDIR /app/

COPY ./requirements.txt /app/

COPY .env /app/

RUN pip install -r requirements.txt

COPY ./app/ /app/app

CMD ["fastapi", "run", "--workers", "1", "--host", "0.0.0.0", "--port", "8000", "app/main.py"]