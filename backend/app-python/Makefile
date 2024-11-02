local-start:
	fastapi run --reload --workers 4 --host 0.0.0.0 --port 8282 app/main.py

format:
	isort app && black app
