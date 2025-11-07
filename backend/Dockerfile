# Use Node.js 20
FROM node:20-slim

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only the minimal dependencies needed for the backend
RUN npm install --omit=dev \
    @hono/node-server@^1.19.5 \
    @hono/trpc-server@^0.4.0 \
    @trpc/server@^11.7.0 \
    hono@^4.10.3 \
    superjson@^2.2.3 \
    zod@^4.1.12 \
    --legacy-peer-deps

# Copy backend files
COPY . .

# Set environment variables
ENV PORT=8080
ENV NODE_ENV=production

# Expose port
EXPOSE 8080

# Start the server directly with node
CMD ["node", "server-simple.js"]
