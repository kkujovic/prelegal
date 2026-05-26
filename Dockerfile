FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.12-slim
WORKDIR /app

RUN pip install uv --no-cache-dir

COPY backend/pyproject.toml backend/uv.lock ./backend/
RUN cd backend && uv sync --no-dev

COPY backend/ ./backend/
COPY catalog.json ./
COPY templates/ ./templates/
COPY --from=frontend-builder /app/frontend/out ./backend/static

WORKDIR /app/backend
EXPOSE 8000
CMD [".venv/bin/uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
