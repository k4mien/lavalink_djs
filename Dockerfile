FROM node:21-alpine as base

ENV NODE_ENV=production
RUN npm i npm@latest -g
USER node
WORKDIR /app
COPY --chown=node:node src/package.json src/package-lock.json ./
RUN npm ci && npm cache clean --force
ENV PATH /app/node_modules/.bin:$PATH

FROM base as dev

ENV NODE_ENV=development
RUN npm install
COPY --chown=node:node ./src ./

FROM base as prod

COPY --chown=node:node ./src ./