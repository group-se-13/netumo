#!/bin/bash

# Set image names
FRONTEND_IMAGE="kubehwa/netumo-frontend"
BACKEND_IMAGE="kubehwa/netumo-backend"

# Build Docker images
echo "Building frontend..."
docker build -t $FRONTEND_IMAGE ./frontend

echo "Building backend..."
docker build -t $BACKEND_IMAGE ./backend

# Push to Docker Hub
echo "Pushing frontend..."
docker push $FRONTEND_IMAGE

echo "Pushing backend..."
docker push $BACKEND_IMAGE

