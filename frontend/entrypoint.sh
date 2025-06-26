#!/bin/sh
# Generate config.js from API_URL env variable (default fallback)
API_URL_VALUE=${API_URL:-http://localhost:4000}
echo "window.RUNTIME_CONFIG = { API_URL: \"$API_URL_VALUE\" };" > /app/build/config.js
exec serve -s build -l 3000
