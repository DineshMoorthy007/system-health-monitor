# System Health Monitor

![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.x-000000?logo=flask&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8%2B-4479A1?logo=mysql&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34C26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

ML-based system health monitoring for CPU, memory, disk, and process load with rule-based evaluation, database storage, and a live dashboard. The backend collects OS metrics, stores them in MySQL, and serves APIs for the frontend dashboard and ML prediction.

## Live Demo

The frontend is deployed on GitHub Pages:
**[https://dineshmoorthy007.github.io/system-health-monitor/](https://dineshmoorthy007.github.io/system-health-monitor/)**

> **Note:** The backend service (hosted on Railway) is currently **suspended**. The live demo will load the dashboard UI, but API calls will not return live data. To get the full experience, run the backend locally by following the [Installation](#installation) and [Run the Backend](#run-the-backend) sections below.

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
├─ Dockerfile
├─ .dockerignore
├─ .env.example
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
DB_PORT=3306
PORT=5000
```

## Run the Backend
From the project root:

```bash
python -m backend.app
```

The API starts on http://127.0.0.1:5000 by default (or the value of PORT) and runs a background thread to collect metrics.

## Run with Docker
From the project root:

```bash
docker build -t system-health-monitor .
docker run --env-file .env -p 5000:5000 system-health-monitor
```

The container health check uses `/api/health/latest` on `PORT` (default `5000`).

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
- Run the backend from the project root with `python -m backend.app` to avoid import path issues.

## Troubleshooting
- ModuleNotFoundError: run from the project root: python -m backend.app
- Database connection error: verify .env values and MySQL status
- Empty dashboard: confirm backend is running and database has data

## Documentation
For detailed information about the project's development phases and architecture, see:

- [Architecture Overview](docs/architecture_overview.md) — System design and component description
- [Phase 1: System Monitoring & Rule-Based Evaluation](docs/phase1_overview.md) — OS metric collection and health scoring
- [Phase 2: Visualization & System Health Trends](docs/phase2_overview.md) — Dashboard and data visualization
- [Phase 3: Machine Learning-Based Prediction](docs/phase3_overview.md) — ML model training and prediction

## Deployment

This section explains how this project was deployed — frontend via **GitHub Pages** and backend + database via **Railway**. Use it as a guide to deploy your own fork.

---

### Frontend — GitHub Pages

GitHub Pages hosts static files (HTML, CSS, JS) directly from a repository branch or folder. Here's how the frontend of this project is deployed automatically on every push to `main`:

**How it works:**
1. A GitHub Actions workflow (`.github/workflows/deploy-frontend.yml`) is triggered on every push to `main`.
2. The workflow checks out the repo, configures GitHub Pages, uploads the `frontend/` folder as a Pages artifact, and deploys it.
3. GitHub Pages serves the contents of `frontend/` as a static website.

**Steps to set it up yourself:**
1. Go to your repository → **Settings** → **Pages**.
2. Under *Source*, select **GitHub Actions**.
3. Create the workflow file at `.github/workflows/deploy-frontend.yml` with the following content:

```yaml
name: Deploy Frontend to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload frontend folder
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./frontend

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

4. Push to `main` — the workflow will run and your site will be live at `https://<your-username>.github.io/<repo-name>/`.

> **Tip:** If your frontend JS makes API calls to the backend, make sure the backend URL is configurable (e.g., via a constant in `frontend/js/`) so you can point it to your Railway deployment URL instead of `localhost`.

---

### Backend + Database — Railway

[Railway](https://railway.app) is a cloud platform that can host your Flask app and a MySQL database together with minimal configuration.

**How it works:**
- Railway reads your `Dockerfile` (or auto-detects Python) to build and run the Flask backend.
- A MySQL plugin is added in the same Railway project, and Railway injects the DB connection variables as environment variables automatically.
- Your app reads these from `.env` / environment variables (already set up via `.env.example`).

**Steps to deploy:**

1. **Create a Railway account** at [railway.app](https://railway.app) and create a new project.

2. **Add a MySQL database:**
   - Inside the project, click **+ New** → **Database** → **MySQL**.
   - Railway provisions the database and exposes variables like `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, and `MYSQL_PORT`.

3. **Deploy the backend:**
   - Click **+ New** → **GitHub Repo** and connect your repository.
   - Railway detects the `Dockerfile` and builds it.
   - In the service's **Variables** tab, add your environment variables (map Railway's MySQL vars to the names your app expects):
     ```
     DB_HOST=${{MySQL.MYSQLHOST}}
     DB_USER=${{MySQL.MYSQLUSER}}
     DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
     DB_NAME=${{MySQL.MYSQLDATABASE}}
     DB_PORT=${{MySQL.MYSQLPORT}}
     PORT=5000
     ```
   - Railway injects these at runtime.

4. **Run the DB schema:**
   - Open the MySQL service in Railway → **Query** tab (or connect via a client using the Railway-provided credentials).
   - Paste and run the contents of `sql/schema.sql` to create the required tables.

5. **Get the public URL:**
   - In your backend service settings, go to **Settings** → **Networking** → **Generate Domain**.
   - Copy the generated URL (e.g., `https://your-service.up.railway.app`) and update the API base URL in your frontend JS files.

6. **Re-deploy the frontend** (push to `main`) so it points to the live Railway backend URL.

> **Free tier note:** Railway's free hobby plan has limited runtime hours per month. If the service runs out of hours or is inactive, it will be **suspended** — which is why the live demo on this repo currently shows the dashboard UI without live data. To restore it, upgrade the plan or redeploy the service.

---

## License
MIT License. See LICENSE for details.
