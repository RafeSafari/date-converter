# Stage 1: Build the static site
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve the exported site with Nginx
FROM nginx:1.27-alpine AS server

COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
