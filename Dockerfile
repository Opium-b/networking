# ==============================================
# STAGE 1: Build the React Application
# ==============================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy the rest of your application code
COPY . .

# Build the production-ready static files
RUN npm run build

# ==============================================
# STAGE 2: Serve the application with Nginx
# ==============================================
FROM nginx:stable-alpine

# Copy the built static files from Stage 1 to Nginx's HTML folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration to handle React Router routing properly
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]