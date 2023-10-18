FROM node:20.8.0 as dev
WORKDIR /app
COPY src/package.json .
RUN npm install -y
COPY src ./