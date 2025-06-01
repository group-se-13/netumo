

# 🚀 Mini-Netumo - Website Monitoring System

Mini-Netumo is a lightweight website monitoring system that allows users to register websites (targets) to be monitored for uptime, response status, and performance. The system periodically checks each target and logs the results in a PostgreSQL database.

---

## 🛠️ Tech Stack

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** — modern, fast (high-performance), web framework for Python.
- **[SQLAlchemy](https://www.sqlalchemy.org/)** — ORM for interacting with PostgreSQL.
- **[Databases](https://www.encode.io/databases/)** — Async database support for SQLAlchemy.
- **[Celery](https://docs.celeryq.dev/)** — Distributed task queue for background jobs.
- **[Redis](https://redis.io/)** — Message broker used by Celery.
- **[HTTPX](https://www.python-httpx.org/)** — Async HTTP client for checking websites.

### Frontend (Planned)
- **React + TypeScript**
- **TailwindCSS**
- **Chart.js + React Chart.js 2**
- **React Query**

---


---

## ✅ Features Completed

- [x] Add monitoring targets via API (`POST /targets`)
- [x] List all monitoring targets (`GET /targets`)
- [x] View individual target (`GET /targets/{id}`)
- [x] Background task (via Celery) to:
  - Periodically check URLs
  - Record response time, status code, and errors
- [x] Store monitoring logs in `monitoring_results` table
- [x] API to fetch monitoring logs with filters (`GET /monitoring`)

---

## 🚧 Features in Progress

- [ ] React frontend with:
  - [ ] Form to add new monitoring targets
  - [ ] List view of targets with their statuses
  - [ ] Charts of historical uptime and response time
- [ ] Docker-based deployment
- [ ] CI/CD with GitHub Actions or similar

---

## 📦 Installation

### Backend Setup

1. Clone the repository:

```bash
git remote add origin https://github.com/FineDR/netumo.git
cd mini-netumo
````

2. Create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file and configure:

```
DATABASE_URL=postgresql://user:password@localhost:5432/netumo
REDIS_URL=redis://localhost:6379/0
```

5. Run the FastAPI server:

```bash
uvicorn app.main:app --reload
```

6. Start the Celery worker:

```bash
celery -A app.celery_worker.celery_app worker --loglevel=info
```

7. Start Celery beat (for periodic tasks):

```bash
celery -A app.celery_worker.celery_app beat --loglevel=info
```

---

## 📬 API Endpoints

### Monitoring Targets

| Method | Endpoint               | Description       |
| ------ | ---------------------- | ----------------- |
| GET    | `/targets/`            | Read Targets      |
| POST   | `/targets/`            | Create Target     |
| GET    | `/targets/{target_id}` | Read Target       |

### Monitoring Results

| Method | Endpoint        | Description            |
| ------ | --------------- | ---------------------- |
| GET    | `/results/`     | Get Monitoring Results |

### Default

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET    | `/`      | Root        |


---

## 📈 Upcoming Frontend

The frontend will be built using React and allow users to:

* Add new targets via a form
* View status and logs of all monitored targets
* Visualize uptime and performance with charts

---

## 👨‍💻 Author

**Group 13 - CS 421 Capstone Project**
University of Dodoma, 2025

---

## 📖 License

This project is licensed under the MIT License.

```


# netumo
