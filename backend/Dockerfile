# Backend Dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build

FROM node:20-alpine as prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY ./certs /etc/ssl
RUN chown -R node:node /app
USER node
EXPOSE 4000
CMD ["node", "dist/main.js"]
