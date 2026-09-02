FROM node:18-alpine

WORKDIR /usr/src/app

# Install curl to download tessdata
RUN apk add --no-cache curl ca-certificates

# copy package manifest first for better cache utilization
COPY package.json package-lock.json* ./

# Install all dependencies (including dev) so container can run tests
RUN npm ci || npm install

COPY . ./

# Expose port and provide a default
EXPOSE 5000

# Default command runs the server; CI can override to run tests (e.g., `docker compose run backend npm test`)
CMD [ "node", "server.js" ]
