
# ![Docker](https://img.shields.io/badge/Docker-2D3748?style=for-the-badge&logo=docker&logoColor=white) Setup

## Summary

This document provides a comprehensive guide for setting up and managing Docker for a Next.js application. It includes instructions on installing Docker, understanding the project structure, creating and setting up the project, building and running Docker images, and using `docker-compose` for different environments. Additionally, it covers how to push images to Docker Hub and manage Docker Hosts and images effectively.

## Table of Contents
1. [Install Docker](#install-docker-if-not-installed)
2. [Docker Structure](#docker-structure)
3. [Create and Set Up Your Project](#create-and-set-up-your-project)
4. [Build the Docker Image](#build-the-docker-image)
5. [Verify the Image is Built](#verify-the-image-is-built)
6. [Run the Docker Container](#run-the-docker-container)
7. [Check if it’s Running](#check-if-its-running)
8. [Verify Running Containers](#verify-running-containers)
9. [Stop and Remove Docker Containers](#stop-and-remove-docker-containers)
10. [Push the Image to Docker Hub (Optional)](#push-the-image-to-docker-hub-optional)
11. [Running Your Docker Container from Docker Hub](#running-your-docker-container-from-docker-hub)
12. [How to Use docker-compose for Different Environments](#how-to-use-docker-compose-for-different-environments)
    - [For Local Development](#for-local-development)
    - [For Local Stage](#for-local-stage)
    - [For Local Prod](#for-local-prod)
13. [How to Remove docker-compose for Different Environments](#how-to-remove-docker-compose-for-different-environments)
    - [Log in to Docker Hub](#log-in-to-docker-hub)
    - [Build the image](#build-the-image)
    - [Tag the image for Docker Hub](#tag-the-image-for-docker-hub)
    - [Push the image to Docker Hub](#push-the-image-to-docker-hub)
    - [Pull and run the image anywhere](#pull-and-run-the-image-anywhere)
14. [How to Remove composed docker for Different Environments](#how-to-remove-composed-docker-for-different-environments)

## Install Docker (if not installed)

* Download Docker from the official site: Docker Desktop
* Install and start Docker Desktop
* Verify installation by running:

```sh 
docker --version
```

## Docker Structure
### Single Env environment

```
Project
│── Dockerfile
│── .dockerignore
```

### Multi environment  
```
Project (Multi env)
│── docker
│   │── Dockerfile.local
│   │── Dockerfile.stage
│   │── Dockerfile.prod
│── docker-compose.yml
│── .dockerignore
```

## Create and Set Up Your Project

Make sure you have a project with a `Dockerfile`. Here’s a simple one for your Next.js app:

```dockerfile
# Use the official Node.js image as the base image
FROM node:22.12.0

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that you want app to run on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "<scriptName>"]
```

## Build the Docker Image
Run the following command inside the project folder (where your Dockerfile is located):

```sh
docker build -t <dockerhub-username>/<repository-name>:<tag> .
```
* `-t <dockerhub-username>/<repository-name>:<tag>` → Tags the image with latest.
* `.` → Specifies the current directory as the build context.

## Verify the Image is Built
Load the list of images and find the image you want to run:

```sh
docker images
```

## Run the Docker Container
Run the following command to start the container:

```sh
docker run -p <host>:<Docker Host> --name <containerName>-container <dockerhub-username>/<repository-name>:<tag>
```
* `-p <host>:<Docker Host>` → Maps port `<host (i.e: 3000)>` of the container to port `<Docker Host (i.e: 3000)> ` on your local machine.
* `--name <containerName>-container` → Assigns a name to the running container.
* `<dockerhub-username>/<repository-name>:<tag>` → Runs the built image.

## Check if it’s Running
Open a browser and go to: `http://localhost:<host (i.e: 3000)> `

> ℹ️ If your app is running correctly, you should see your website.

## Verify Running Containers
To see running containers:

```sh 
docker ps
```

If you want to see all containers (including stopped ones):

```sh 
docker ps -a
```

## Stop and Remove Docker Containers
To stop the container:

```sh 
docker stop <containerName>-container
```

To remove the container:

```sh 
docker rm <containerName>-container
```

To remove the Docker image:

```sh 
docker rmi <dockerhub-username>/<repository-name>:<tag>
```

## Push the Image to Docker Hub (Optional)
First, log in to Docker Hub:

```sh 
docker login
```

Then, push the image:

```sh
docker push <dockerhub-username>/<repository-name>:<tag>
```
> ℹ️ Now, you can pull and run this image from anywhere.

## Running Your Docker Container from Docker Hub
On any machine with Docker installed, run:

```sh
docker pull <dockerhub-username>/<repository-name>:<tag>

docker run -p 3000:3000 --name <containerName>-container <dockerhub-username>/<repository-name>:<tag>
```

## How to Use docker-compose for Different Environments
#### For Local Development
```sh
docker build -f docker/Dockerfile.local -t myapp:local .
docker run -p <host>:<Docker Host> --name <appLocal>-container <dockerhub-username>/<repository-name>:<tag>
```

#### For Local Stage
```sh
docker build -f docker/Dockerfile.stage -t myapp:stage .
docker run -p <host>:<Docker Host> --name <appStage>-container <dockerhub-username>/<repository-name>:<tag>
```

#### For Local Prod
```sh
docker build -f docker/Dockerfile.<env> -t myapp:<env> .

docker run -p <host>:<Docker Host> --name <appProd>-container <dockerhub-username>/<repository-name>:<tag>
```

## How to Remove docker-compose for Different Environments
#### Log in to Docker Hub
```sh
docker login
```
##### 2. Build the image
```sh
docker build -f docker/Dockerfile.<env> -t myapp:prod .
```
##### 3. Tag the image for Docker Hub
```sh
docker tag myapp:prod <containerName>:prod
```
#### 4. Push the image to Docker Hub
```sh
docker push <containerName>:prod
```

#### 5. Pull and run the image anywhere
```sh
docker pull <containerName>:prod

docker run -p <host>:<Docker Host> --name appProd-container <containerName>:prod
```
## How to Remove composed docker for Different Environments
```sh
docker rm -f <appName>-container
docker rmi myapp:stage
```

