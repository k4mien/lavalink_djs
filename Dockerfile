FROM node:21-alpine as dev

ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

RUN npm i npm@latest -g

USER node

WORKDIR /node
COPY --chown=node:node src/package.json src/package-lock.json ./
RUN npm ci

ENV PATH /node/node_modules/.bin:$PATH

WORKDIR /node/app
COPY --chown=node:node src ./