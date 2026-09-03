# # Stage 1: Build React Vite app
# FROM node:20-alpine AS build
# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .
# RUN npm run build

# # Stage 2: Serve static files with Nginx
# FROM nginx:alpine

# COPY --from=build /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

# Stage 1: Build React Vite app
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve static files with Nginx
FROM nginx:alpine

# Buat direktori /var/www/client dan folder sites-available & sites-enabled
RUN mkdir -p /var/www/client /etc/nginx/sites-available /etc/nginx/sites-enabled

# Copy hasil build ke /var/www/client sesuai dengan root pada client.local.conf
COPY --from=build /app/dist /var/www/client

# Copy nginx.conf utama ke /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Copy virtual host ke sites-available dan buat symlink ke sites-enabled
COPY sites-available/client.local.conf /etc/nginx/sites-available/client.local.conf
RUN ln -s /etc/nginx/sites-available/client.local.conf /etc/nginx/sites-enabled/client.local.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
