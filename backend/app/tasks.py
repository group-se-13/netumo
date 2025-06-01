from .celery_worker import celery_app
from .database import database
from .models import targets, monitoring_results
import httpx
import asyncio
from datetime import datetime


@celery_app.task
def check_targets():
    # Run async code in sync celery task
    asyncio.run(_check_targets())


async def _check_targets():
    await database.connect()
    
    # Get all active targets
    all_targets = await database.fetch_all(targets.select().where(targets.c.active == True))

    async with httpx.AsyncClient(timeout=10) as client:
        for target in all_targets:
            url = target["url"]
            target_id = target["id"]

            try:
                start = datetime.utcnow()
                response = await client.get(url)
                response_time = (datetime.utcnow() - start).total_seconds()

                status_code = response.status_code
                success = 200 <= status_code < 400
                error = None

            except Exception as e:
                status_code = None
                response_time = None
                success = False
                error = str(e)

            # Save the monitoring result to DB
            insert_query = monitoring_results.insert().values(
                target_id=target_id,
                status_code=status_code,
                response_time=response_time,
                checked_at=datetime.utcnow(),
                success=success,
                error=error,
            )
            await database.execute(insert_query)
            print(f"Checked {target['name']} ({url}): success={success}, status={status_code}")

    await database.disconnect()
