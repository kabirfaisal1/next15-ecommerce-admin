# ![GitHub Action](https://img.shields.io/badge/githubaction-2D3748?style=for-the-badge&logo=github&logoColor=white)


## Build, Push, Stage, Docker Container

### Overview
This GitHub Actions workflow automates the process of building, pushing, and staging a Docker container. It ensures that the container is built with the latest code, pushed to Docker Hub, and tested for a specified duration before being cleaned up.

#### Workflow Trigger
This workflow is manually triggered using `workflow_dispatch`.

### Jobs and Their Purpose

#### 1. **Build and Push Docker Image**
Runs on `ubuntu-latest` and executes the following steps:

#### **Checkout Repository**
Checks out the repository so that workflow files are available for use.
```yaml
- name: Checkout repository
  uses: actions/checkout@v3
```

#### **Create `.env` file from Secrets**
Extracts secrets stored in GitHub and creates a `.env` file to store necessary environment variables.
```yaml
- name: Create .env file from GitHub Secrets
  run: |
    echo "Generating .env file..."
    echo "${{ secrets.APP_SECRET }}" >> .env
    echo "DOCKER_IMAGE_NAME=<dockerRepo>/<containerName>" >> .env
    cat .env
```

#### **Load and Validate Environment Variables**
Loads variables from `.env` and ensures `DOCKER_IMAGE_NAME` is correctly set.
```yaml
- name: Load and Export Environment Variables
  run: |
    set -a
    source .env
    set +a
    echo "DOCKER_IMAGE_NAME is set to: '$DOCKER_IMAGE_NAME'"
    if [[ -z "$DOCKER_IMAGE_NAME" ]]; then
      echo "ERROR: DOCKER_IMAGE_NAME is empty! Check your .env file."
      exit 1
    fi
  env:
    DOCKER_IMAGE_NAME: ${{ secrets.DOCKER_IMAGE_NAME }}
```

#### **Log in to Docker Hub**
Authenticates to Docker Hub using GitHub Secrets.
```yaml
- name: Log in to Docker Hub
  run: |
    echo "${{ secrets.DOCKER_PASSWORD }}" | docker login --username "${{ secrets.DOCKER_USERNAME }}" --password-stdin
    echo "Logged in to Docker Hub as ${{ secrets.DOCKER_USERNAME }}"
```

#### **Build Docker Image**
Builds the Docker image using the specified Dockerfile.
```yaml
- name: Build Docker Image
  run: |
    docker build -f docker/Dockerfile.stage -t "$DOCKER_IMAGE_NAME:stage" .
  env:
    DOCKER_IMAGE_NAME: <dockerRepo>/<containerName>
```

#### **Push Docker Image to Docker Hub**
Pushes the built image to Docker Hub.
```yaml
- name: Push Docker Image
  run: |
    docker push "$DOCKER_IMAGE_NAME:stage"
  env:
    DOCKER_IMAGE_NAME: <dockerRepo>/<containerName>
```

#### **Print Deployment Instructions**
Displays instructions on how to pull and run the image manually.
```yaml
- name: Print Deployment Instructions
  run: |
    echo "To pull and run the image anywhere, use the following commands:"
    echo "docker pull $DOCKER_IMAGE_NAME:stage"
    echo "docker run -p 8000:3000 --name appStage-container $DOCKER_IMAGE_NAME:stage"
  env:
    DOCKER_IMAGE_NAME: <dockerRepo>/<containerName>
```

#### **Run Container for 120 Minutes**
Allows the container to run for testing and verification.
```yaml
- name: Let the container run for 120 minutes
  run: sleep 7200
```

#### **Stop and Remove the Container**
Stops and removes the running container.
```yaml
- name: Stop and Remove Docker Container
  run: |
    docker stop appStage-container
    docker rm appStage-container
```

#### **Remove the Docker Image**
Deletes the Docker image to free up space.
```yaml
- name: Remove Docker Image
  run: |
    docker rmi "$DOCKER_IMAGE_NAME:stage" || echo "Image already removed"
  env:
    DOCKER_IMAGE_NAME: <dockerRepo>/<containerName>
```


## Stop and Cleanup Stage Docker Container

### Overview
This GitHub Actions workflow is designed to stop and clean up a running stage Docker container. It ensures that any existing container and image related to the application are properly removed, preventing conflicts and freeing up resources.

### Workflow Trigger
This workflow is manually triggered using `workflow_dispatch`.

### Jobs and Their Purpose

### 1. **Stop and Cleanup Docker Container**
Runs on `ubuntu-latest` and executes the following steps:

#### **Log in to Docker Hub**
Authenticates to Docker Hub using GitHub Secrets to ensure access to the necessary Docker images.
```yaml
- name: Log in to Docker Hub
  run: |
    echo "${{ secrets.DOCKER_PASSWORD }}" | docker login --username "${{ secrets.DOCKER_USERNAME }}" --password-stdin
    echo "Logged in to Docker Hub as ${{ secrets.DOCKER_USERNAME }}"
```

#### **Check and Stop/Remove Container**
Verifies if the container exists before attempting to stop and remove it.
```yaml
- name: Check and Stop/Remove Container
  run: |
    CONTAINER_NAME="appStage-container"
    if [ "$(docker ps -a -q -f name=$CONTAINER_NAME)" ]; then
      echo "Stopping container..."
      docker stop $CONTAINER_NAME
      echo "Removing container..."
      docker rm $CONTAINER_NAME
    else
      echo "No container found with name $CONTAINER_NAME. Skipping stop and remove."
    fi
```

#### **Remove Docker Image**
Deletes the Docker image if it exists, avoiding errors if the image is not found.
```yaml
- name: Remove Docker Image
  run: |
    IMAGE_NAME="<dockerRepo>/<containerName>"
    OUTPUT=$(docker rmi "$IMAGE_NAME" 2>&1) || true
    if echo "$OUTPUT" | grep -q "No such image"; then
      echo "No image found with name $IMAGE_NAME. Skipping removal."
      exit 0  # Prevents job failure
    elif [ -n "$OUTPUT" ]; then
      echo "Error while removing image: $OUTPUT"
      exit 1  # Fails for any other error
    fi
```
