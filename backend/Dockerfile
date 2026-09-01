FROM node:18-alpine

WORKDIR /usr/src/app

# Install curl to download tessdata
RUN apk add --no-cache curl ca-certificates

# copy package manifest first for better cache utilization
COPY package.json package-lock.json* ./

# Install all dependencies (including dev) so container can run tests
RUN npm ci || npm install

# Create tessdata directory and download English traineddata to avoid runtime fetches
RUN mkdir -p /usr/src/app/tessdata \
  && curl -fsSL -o /usr/src/app/tessdata/eng.traineddata \
    https://github.com/tesseract-ocr/tessdata/raw/main/eng.traineddata || echo "Warning: failed to download eng.traineddata"

COPY . ./

# Ensure tessdata is readable
RUN chmod -R a+r /usr/src/app/tessdata || true

# Expose port and provide a default
EXPOSE 5000

# Default command runs the server; CI can override to run tests (e.g., `docker compose run backend npm test`)
CMD [ "node", "server.js" ]
