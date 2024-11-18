FROM node:18-alpine
WORKDIR /app

ENV ENVIRONMENT=docker-development
ENV POSTGRES_READ_DB_HOST=host.docker.internal
ENV POSTGRES_WRITE_DB_HOST=host.docker.internal

COPY ./package.json ./package-lock.json
COPY . .
RUN npm install
RUN npm run build

CMD ["node", "./bin/app.js"]
EXPOSE 8080