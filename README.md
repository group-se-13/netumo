
---

#  Mini-Netumo - Website Monitoring System

> **Capstone Project - CS 421: Application Deployment and Management**
> **The University of Dodoma** — College of Informatics and Virtual Education
> **Instructor:** Dr. Goodiel C. Moshi
> **Submission Date:** 12th June 2025
> **Developed by:** Group 13

---

## Project Overview

**Mini-Netumo** is a lightweight, open-source website monitoring system inspired by commercial tools like Netumo. It is designed to:

* Continuously monitor website uptime and response latency.
* Check SSL certificate and domain registration validity.
* Notify users via email or webhook when issues are detected.

This project demonstrates real-world deployment of microservices using DevOps best practices, containerization, and CI/CD, as required by the CS 421 Capstone Project.

---

## Objectives

* Schedule periodic HTTP/HTTPS checks for registered targets.
* Log response status codes, latency, and failure timestamps.
* Perform daily SSL and WHOIS checks.
* Notify users of downtime or expiring certificates/domains.
* Provide a user-friendly frontend dashboard.
* Implement CI/CD pipeline and deploy a live service to AWS.

---

## Tech Stack

### Backend

* **FastAPI** — Modern async web framework
* **PostgreSQL** — Relational database
* **SQLAlchemy** — ORM
* **Celery + Redis** — Task queue and message broker
* **HTTPX** — Async HTTP client
* **OpenSSL / WHOIS** — Certificate and domain validity checks

### Frontend

* **React + TypeScript** — SPA dashboard
* **TailwindCSS** — Utility-first CSS
* **Chart.js / React-Chartjs-2** — Uptime and latency visualizations
* **React Query** — Data fetching

### DevOps

* **Docker + Docker Compose** — Containerization
* **NGINX** — Load balancer for high availability
* **GitHub Actions** — CI/CD pipeline for test/build/deploy
* **AWS EC2** — Deployment on Free-Tier

---

## Features

### Completed

* [x] API endpoints for targets and monitoring results
* [x] Periodic uptime checks via Celery workers
* [x] Daily SSL and domain expiry checks
* [x] Alerts via email and webhooks
* [x] PostgreSQL data persistence
* [x] Dockerized microservices architecture
* [x] CI/CD pipeline via GitHub Actions is not full completed yet
* [x] Auto-deployment to AWS EC2 with zero-downtime
* [x] Frontend dashboard with real-time status and charts

### In Progress

* [ ] Additional frontend filtering and charts
* [ ] Multi-user authentication support

---

## API Endpoints

| Method | Endpoint        | Description                    |
| ------ | --------------- | ------------------------------ |
| GET    | `/targets/`     | List all monitoring targets    |
| POST   | `/targets/`     | Add new monitoring target      |
| GET    | `/targets/{id}` | Get details of specific target |
| GET    | `/results/`     | Fetch all monitoring logs      |

Secured via JWT and fully documented with Swagger (OpenAPI).

---

##  Setup Instructions

### Backend (FastAPI + Celery)

```bash
# Clone the repository
git clone https://github.com/group-se-13/netumo.git
cd netumo

# Set up virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit DATABASE_URL and REDIS_URL as needed

# Start FastAPI server
uvicorn app.main:app --reload

# Start Celery worker
celery -A app.celery_worker.celery_app worker --loglevel=info

# Start Celery beat
celery -A app.celery_worker.celery_app beat --loglevel=info
```

### Frontend (React + TypeScript)

```bash
cd frontend
npm install
npm run dev
```

### Docker Compose

```bash
docker-compose up --build -d
```

> Visit the app at: `http://16.171.255.190/`

---

## Live Deployment

* **API Base URL:** `http://16.171.255.190/api`
* **Frontend Dashboard:** `http://16.171.255.190/`
* **Deployed via:** GitHub Actions → Docker Hub → AWS EC2

---

## Repository Structure

```plaintext
netumo/
├── backend/                   # FastAPI backend
│   ├── api/               # API routes
├── frontend/              # React frontend
├── docker-compose.yml     # Orchestration
├── .github/workflows/     # CI/CD config
├── requirements.txt
└── README.md              # This file
```

---

## Artefact Bundle (to be submitted)

* `/logs/` — compressed monitoring and notification logs
* `/db_backup.sql.gz` — auto-generated DB backup

---

## Contributors

**Group 13** — CS 421, University of Dodoma
Include a *Responsibility Matrix* in the design dossier PDF (RACI).

---

## License

This project is licensed under the **MIT License**. See `LICENSE` for details.

---

##  Contact

For questions or feedback:

*  **Instructor:** [goodiel.moshi@udom.ac.tz](mailto:goodiel.moshi@udom.ac.tz)
*  **Course:** CS 421 - Application Deployment and Management
*  **Institution:** The University of Dodoma

---

###  Ready for Grading

This repository includes:

* [x] Complete source code and Docker stack
* [x] CI/CD pipeline and GitHub Actions
* [x] Live EC2 deployment
* [x] Design dossier PDF
* [x] Artefact bundle (logs, backups)

---

