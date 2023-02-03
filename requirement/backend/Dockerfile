FROM node:16

# Set the working directory
WORKDIR /app

# Install the backend dependencies and build the backend
RUN npm install && npm run build

# Copy the configuration files into the container
COPY ./nest.env /

# Install the runtime dependencies
RUN npm install --production

# Expose the backend port
EXPOSE 4243

# Set the command to start the backend
ENTRYPOINT ["npm", "start", "run"]
