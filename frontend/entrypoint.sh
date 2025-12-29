#!/bin/sh
# Generate config.js from env variables
# Check VITE_API_URL first (from docker-compose), then API_URL, then default
API_URL_VALUE=${VITE_API_URL:-${API_URL:-http://localhost:4000}}
echo "window.RUNTIME_CONFIG = { API_URL: \"$API_URL_VALUE\" };" > /app/build/config.js
exec serve -s build -l 3000
