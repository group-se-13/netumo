from celery import Celery
import os
import dotenv

dotenv.load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "mini_netumo",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["app.tasks"]
)

celery_app.conf.beat_schedule = {
    'check_targets_every_minute': {
        'task': 'app.tasks.check_targets',
        'schedule': 60.0,  # every 60 seconds
    },
}
