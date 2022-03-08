FROM docker.mirror.hashicorp.services/node:14.17.0-alpine AS base
RUN apk add --update --no-cache git make g++ automake autoconf libtool nasm libpng-dev

COPY ./package.json ./package-lock.json /website/
WORKDIR /website
RUN npm install -g npm@latest && npm ci

FROM base AS full
COPY . /website