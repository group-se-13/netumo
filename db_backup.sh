#!/bin/bash

# Correct container name
DB_CONTAINER="netumo-db-1"

# Timestamp
DATE=$(date +%Y-%m-%d_%H-%M)

# Backup destination
BACKUP_FILE="/home/ubuntu/netumo/db_backup_$DATE.sql.gz"

# Run pg_dump inside the PostgreSQL container and gzip the output
docker exec $CONTAINER_NAME pg_dump -U feleshi mini_netumo_db | gzip > "$BACKUP_FILE"
