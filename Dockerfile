FROM docker.mirror.hashicorp.services/node:14.17.0-alpine AS base
RUN apk add --update --no-cache git make g++ automake autoconf libtool nasm libpng-dev

COPY ./package.json ./package-lock.json /website/
WORKDIR /website

RUN npm install -g npm@latest
# While imagemin/optipng-bin doesn't support arm64, set this env var as a workaround
# - `npm ls imagemin`
# - see https://github.com/imagemin/optipng-bin/issues/118
RUN CPPFLAGS="-DPNG_ARM_NEON_OPT=0" npm install

FROM base AS full
COPY . /website