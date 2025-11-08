# Use Node.js 20
FROM node:20-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (we need devDependencies for ts-node if using server.js)
# But for server-simple.js, we only need production dependencies
RUN npm install --omit=dev --legacy-peer-deps

# Copy all application code
COPY . .

# Set environment variables
ENV PORT=8080
ENV NODE_ENV=production

# Expose port
EXPOSE 8080

# Use the simple server that doesn't need TypeScript compilation
CMD ["node", "backend/server-simple.js"]
