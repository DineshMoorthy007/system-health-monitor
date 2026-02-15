# System Health Monitor

![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.x-000000?logo=flask&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8%2B-4479A1?logo=mysql&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34C26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

ML-based system health monitoring for CPU, memory, disk, and process load with rule-based evaluation, database storage, and a live dashboard. The backend collects OS metrics, stores them in MySQL, and serves APIs for the frontend dashboard and ML prediction.

## Features
- Live system metrics collection (CPU, memory, disk, process count)
- Rule-based health scoring and status evaluation
- ML-based health prediction (Random Forest)
- MySQL storage with historical metrics
- REST API for latest metrics, history, summary, and prediction
- Frontend dashboard with tables and charts

## Tech Stack
- Backend: Python, Flask, psutil, scikit-learn
- Database: MySQL (mysql-connector-python)
- Frontend: HTML, CSS, JavaScript, Chart.js

## Project Structure
- backend/: Flask API, collectors, ML, and database access
- frontend/: dashboard UI
- sql/: database schema
- docs/: documentation

```text
system-health-monitor/
├─ backend/
│  ├─ algorithms/
│  ├─ collectors/
│  ├─ database/
│  ├─ ml/
│  ├─ utils/
│  └─ app.py
├─ frontend/
│  ├─ assets/
│  ├─ css/
│  ├─ js/
│  └─ index.html
├─ sql/
│  └─ schema.sql
├─ docs/
├─ logs/
├─ requirements.txt
└─ README.md
```

## Prerequisites
- Python 3.10+ (3.11 recommended)
- MySQL Server 8+
- pip

## Installation
1) Clone the repo and open the project root.
2) Create and activate a virtual environment (optional but recommended).
3) Install dependencies:

```bash
pip install -r requirements.txt
```

## Database Setup
1) Create the database and table:

```sql
-- Run in MySQL client
SOURCE sql/schema.sql;
```

2) Create a .env file in the project root with your DB credentials:

```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=system_health_db
```

## Run the Backend
From the project root:

```bash
python backend/app.py
```

The API starts on http://127.0.0.1:5000 and also runs a background thread to collect metrics.

## Run the Frontend
Open the dashboard in your browser:

- Open frontend/index.html directly, or
- Serve it with a simple static server (recommended):

```bash
python -m http.server 8000 --directory frontend
```

Then visit http://127.0.0.1:8000.

## API Endpoints
- GET /api/health/latest
- GET /api/metrics/recent
- GET /api/metrics/history
- GET /api/health/summary
- GET /api/health/predict

## Train the ML Model (Required if model files are missing)
Since model files are not committed to the repo, you must train them locally before using the prediction endpoint.

To train the Random Forest model:

```bash
python backend/ml/train_random_forest.py
```

Saved models are stored in backend/ml/saved_models.

## Notes
- The prediction endpoint uses the latest stored metrics to run inference.
- If you run app.py from a different working directory, set PYTHONPATH or run from the project root.

## Troubleshooting
- ModuleNotFoundError: run from the project root: python backend/app.py
- Database connection error: verify .env values and MySQL status
- Empty dashboard: confirm backend is running and database has data

## Documentation
For detailed information about the project's development phases and architecture, see:

- [Architecture Overview](docs/architecture_overview.md) — System design and component description
- [Phase 1: System Monitoring & Rule-Based Evaluation](docs/phase1_overview.md) — OS metric collection and health scoring
- [Phase 2: Visualization & System Health Trends](docs/phase2_overview.md) — Dashboard and data visualization
- [Phase 3: Machine Learning-Based Prediction](docs/phase3_overview.md) — ML model training and prediction

## License
MIT License. See LICENSE for details.
