FROM nginx:stable-alpine
COPY . /usr/share/nginx/html
# Remove default nginx index if present
RUN rm -f /usr/share/nginx/html/default.conf || true
EXPOSE 80
