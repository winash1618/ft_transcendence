# FROM nginx:latest

# # COPY nginx.conf /etc/nginx/nginx.conf
# # COPY default.conf /etc/nginx/conf.d/default.conf
# # COPY index.html /usr/share/nginx/html/index.html

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]



# Use the official Node.js image as the base image
# FROM node:latest

# # Create makea working directory
# WORKDIR /app

# # # # # Copy the package.json and package-lock.json files to the working directory
# # COPY ./package.json .

# # # Install the dependencies
# RUN npm install -g npm@9.4.0 && npm install -g @nestjs/cli

# # # Copy the rest of the application files
# COPY ./entry_point.sh .

# # # Expose the application port
# EXPOSE 80

# RUN npm config set script-shell /bin/sh

# RUN nest new project --package-manager=npm

# # Run the NestJS development server
# # # Run the NestJS development server
# ENTRYPOINT ["/bin/sh", "entry_point.sh"]




