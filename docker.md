
# ![Docker](https://img.shields.io/badge/Docker-2D3748?style=for-the-badge&logo=docker&logoColor=white) Setup

## Table of Contents
1. [Install Docker](#install-docker-if-not-installed)
2. [Create and Set Up Your Project](#create-and-set-up-your-project)
3. [Build the Docker Image](#build-the-docker-image)
4. [Verify the Image is Built](#verify-the-image-is-built)
5. [Run the Docker Container](#run-the-docker-container)
6. [Check if it’s Running](#check-if-its-running)
7. [Verify Running Containers](#verify-running-containers)
8. [Stop and Remove Docker Containers](#stop-and-remove-docker-containers)
9. [Push the Image to Docker Hub (Optional)](#push-the-image-to-docker-hub-optional)
10. [Running Your Docker Container from Docker Hub](#running-your-docker-container-from-docker-hub)
11. [Commands Summary](#commands-summary)

## Install Docker (if not installed)

* Download Docker from the official site: Docker Desktop
* Install and start Docker Desktop
* Verify installation by running:

```sh 
docker --version
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
docker build -t <dockerRepo>:latest .
```
* `-t <dockerRepo>:latest` → Tags the image with latest.
* `.` → Specifies the current directory as the build context.

## Verify the Image is Built
Load the list of images and find the image you want to run:

```sh
docker images
```

## Run the Docker Container
Run the following command to start the container:

```sh
docker run -p 3000:3000 --name <containerName>-container <dockerRepo>:latest
```
* `-p 3000:3000` → Maps port 3000 of the container to port 3000 on your local machine.
* `--name <containerName>-container` → Assigns a name to the running container.
* `<dockerRepo>:latest` → Runs the built image.

## Check if it’s Running
Open a browser and go to: `http://localhost:3000`

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
docker rmi <dockerRepo>:latest
```

## Push the Image to Docker Hub (Optional)
First, log in to Docker Hub:

```sh 
docker login
```

Then, push the image:

```sh
docker push <dockerRepo>:latest
```
> ℹ️ Now, you can pull and run this image from anywhere.

## Running Your Docker Container from Docker Hub
On any machine with Docker installed, run:

```sh
docker pull <dockerRepo>:latest

docker run -p 3000:3000 --name <containerName>-container <dockerRepo>:latest
```

## Commands Summary
| Action                     | Command                                                                 |
|----------------------------|-------------------------------------------------------------------------|
| Build Image                | `docker build -t <dockerRepo>:latest .`                                  |
| Run Container              | `docker run -p 3000:3000 --name <containerName>-container <dockerRepo>:latest` |
| List Running Containers    | `docker ps`                                                             |
| Stop Container             | `docker stop <containerName>-container`                                 |
| Remove Container           | `docker rm <containerName>-container`                                   |
| Remove Image               | `docker rmi <dockerRepo>:latest`                                        |
| Push Image to Docker Hub   | `docker push <dockerRepo>:latest`                                       |
| Pull Image from Docker Hub | `docker pull <dockerRepo>:latest`                                       |
