FROM node:18-slim

WORKDIR /usr/src/app

# Install curl (used optionally for debug or scripts)
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# copy package manifest first for better cache utilization
COPY package.json package-lock.json* ./

# Install all dependencies (including dev) so container can run tests
RUN npm ci || npm install

COPY . ./

# Expose port and provide a default
EXPOSE 5000

# Default command runs the server; CI can override to run tests (e.g., `docker compose run backend npm test`)
CMD [ "node", "server.js" ]
