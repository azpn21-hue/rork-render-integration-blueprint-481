# Use Node.js 20
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files from parent directory
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev --legacy-peer-deps

# Copy backend code
COPY backend ./backend

# Set environment
ENV PORT=8080
ENV NODE_ENV=production

# Expose port
EXPOSE 8080

# Run the simple server
CMD ["node", "backend/server-simple.js"]
