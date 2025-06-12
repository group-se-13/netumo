#!/bin/bash

# Create logs directory if not present
mkdir -p /home/ubuntu/netumo/logs

# Timestamp
DATE=$(date +%Y-%m-%d)

# Dump logs from correct containers
docker logs netumo-backend-1 > /home/ubuntu/netumo/logs/backend_$DATE.log
docker logs netumo-worker-1 > /home/ubuntu/netumo/logs/worker_$DATE.log
docker logs netumo-beat-1 > /home/ubuntu/netumo/logs/beat_$DATE.log

# Compress logs folder
tar -czf /home/ubuntu/netumo/logs_$DATE.tar.gz -C /home/ubuntu/netumo logs

# Optional: clean up uncompressed logs
rm -rf /home/ubuntu/netumo/logs
