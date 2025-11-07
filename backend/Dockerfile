# Use Node.js 20 for stability
FROM node:20-slim

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json from root (contains all dependencies)
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev --legacy-peer-deps

# Copy backend code
COPY backend/ ./backend/

# Set environment variables
ENV PORT=8080
ENV NODE_ENV=production

# Expose the port
EXPOSE 8080

# Start the simple server (no TypeScript compilation needed)
CMD ["node", "backend/server-simple.js"]
