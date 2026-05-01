# syntax=docker/dockerfile:1

ARG NODE_VERSION=24

################################################################################
FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app

################################################################################
FROM base as build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

################################################################################
FROM base as final

ENV NODE_ENV production

RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app

USER node

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --chown=node:node --from=build /usr/src/app/dist ./dist

EXPOSE 5173

CMD npm run preview