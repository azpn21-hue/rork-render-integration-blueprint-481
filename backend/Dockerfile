FROM node:20-slim

WORKDIR /usr/src/app

# Install dependencies
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY bun.lock* ./

# Install ALL dependencies (including dev dependencies for ts-node)
RUN npm install --legacy-peer-deps || npm install

# Copy all necessary directories
COPY backend ./backend
COPY lib ./lib
COPY tsconfig.json ./

# Set working directory to backend
WORKDIR /usr/src/app/backend

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

EXPOSE 8080

# Start the server with tRPC support
CMD ["node", "server.js"]
