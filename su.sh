#!/bin/bash

# Stop all running Docker containers
docker stop $(docker ps -qa)

# Remove all unused Docker resources, including stopped containers, networks, and volumes
docker system prune -a

# Stop all running Docker containers
docker stop $(docker ps -qa)

# Remove all Docker containers, both running and stopped
docker rm $(docker ps -qa)

# Remove all Docker images, including those in use by running containers
docker rmi -f $(docker images -qa)

# Remove all Docker volumes
docker volume rm $(docker volume ls -q)

# Remove all Docker networks, suppressing any error messages
docker network rm $(docker network ls -q)  2>/dev/null
