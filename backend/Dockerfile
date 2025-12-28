FROM node:20-alpine AS build
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --frozen-lockfile
COPY backend .
RUN npm run build

FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY backend/certs /etc/ssl
RUN chown -R node:node /app
USER node
EXPOSE 4000
CMD ["node", "dist/main.js"]
