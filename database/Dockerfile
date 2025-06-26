# Database Dockerfile (for custom scripts, optional)
FROM postgres:15-alpine
COPY ./init.sql /docker-entrypoint-initdb.d/init.sql
