# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of your application files
COPY . .

# Build the application for production
RUN yarn build

# Stage 2: Serve the application using Nginx
FROM nginx:1.21-alpine AS server

# Copy built files from the builder stage to Nginx's html directory
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 (default for Nginx)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
