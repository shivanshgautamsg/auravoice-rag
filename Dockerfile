# Production Dockerfile for AuraVoice RAG (HH Goa 2026)
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY backend /app/backend
COPY frontend/dist /app/frontend/dist
COPY run_server.py /app/run_server.py
COPY run_benchmarks.py /app/run_benchmarks.py
COPY latency_report.json /app/latency_report.json

ENV PORT=8000
ENV HOST=0.0.0.0
ENV PYTHONPATH=/app/backend

EXPOSE 8000

# Start server
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
