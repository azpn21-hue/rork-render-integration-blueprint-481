FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy necessary files
COPY backend ./backend
COPY lib ./lib

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Start the simple server
CMD ["node", "backend/server-simple.js"]
