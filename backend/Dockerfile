FROM node:20-slim

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including hono/cors which is needed)
RUN npm install --legacy-peer-deps

# Copy backend directory
COPY backend ./backend

# Copy lib directory (for trpc client)
COPY lib ./lib

# Set working directory to backend
WORKDIR /usr/src/app/backend

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Start the simple server
CMD ["node", "server-simple.js"]
