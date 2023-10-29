#FROM node:20.8.0 as dev
#WORKDIR /app
#COPY src/package.json .
#RUN npm install -y
#COPY src ./

FROM node:20.8.0 as dev

ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

RUN npm i npm@latest -g

USER node

WORKDIR /node
COPY --chown=node:node src/package.json src/package-lock.json ./
RUN npm ci && npm cache clean --force

ENV PATH /node/node_modules/.bin:$PATH

WORKDIR /node/app
COPY --chown=node:node src ./