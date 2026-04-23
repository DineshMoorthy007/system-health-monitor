FROM python:3.10-slim

WORKDIR /app

# Install curl (for healthcheck)
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy files
COPY requirements.txt .
COPY backend/ ./backend/

# Install dependencies
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Expose port (informational)
EXPOSE 5000

# Healthcheck using dynamic PORT
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-5000}/api/health/latest || exit 1

# Run app
CMD ["python", "-m", "backend.app"]
