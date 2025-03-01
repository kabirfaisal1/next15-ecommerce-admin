# Use Node.js base image
FROM node:22.12.0

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --force

# Copy the entire project
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["npm", "run", "docker"]
