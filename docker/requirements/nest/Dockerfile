# Use the official Node.js image as the base image
FROM node:latest

# Create a working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 3000

# Run the NestJS development server
CMD [ "npm", "run", "start:dev" ]
