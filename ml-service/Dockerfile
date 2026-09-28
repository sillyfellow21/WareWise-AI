FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app

RUN useradd --create-home appuser
USER appuser
EXPOSE 8000
# Honour the port injected by the platform (Render sets PORT) and default to 8000
# locally. The service binds 0.0.0.0 so platform health checks can reach it.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]