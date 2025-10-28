# Build stage
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application files to the container
COPY . .

# Build the React app for production
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built React app to nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx configuration if needed
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]