FROM node:20-slim

WORKDIR /usr/src/app

# Install dependencies for Cloud SQL Proxy (optional but recommended)
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for ts-node)
RUN npm install --legacy-peer-deps

# Copy all necessary directories
COPY backend ./backend
COPY lib ./lib
COPY tsconfig.json ./

# Set working directory to backend
WORKDIR /usr/src/app/backend

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Start the server with tRPC support
CMD ["node", "server.js"]
