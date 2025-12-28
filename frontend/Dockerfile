# Frontend Dockerfile
FROM node:20-alpine3.22 AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install --frozen-lockfile

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY frontend .
RUN npm run build

FROM node:20-alpine3.22 AS prod
WORKDIR /app
COPY --from=build /app/build ./build
RUN npm install -g serve
COPY --from=build /app/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh && chown -R node:node /app
USER node
EXPOSE 3000
CMD ["/entrypoint.sh"]
