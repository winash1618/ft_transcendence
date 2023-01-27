# Use the official Node.js image as the base image
FROM node:latest

# Create makea working directory
WORKDIR /app

# # # # # Copy the package.json and package-lock.json files to the working directory
# COPY ./package.json .

# # Install the dependencies
RUN npm install -g npm@9.4.0 && npm install -g @nestjs/cli

# # # Copy the rest of the application files
# COPY ./entry_point.sh .

# # Expose the application port
EXPOSE 3000

RUN npm config set script-shell /bin/sh

# RUN 

# # Run the NestJS development server
ENTRYPOINT ["/bin/sh", "entry_point.sh"]

