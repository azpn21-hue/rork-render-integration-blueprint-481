FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy necessary files
COPY backend ./backend
COPY lib ./lib
COPY tsconfig.json ./

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Start the simple server from root
CMD ["node", "backend/server-simple.js"]
