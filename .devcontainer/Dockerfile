FROM mcr.microsoft.com/devcontainers/typescript-node:1-26-bookworm

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        ca-certificates \
        curl \
        git \
        && rm -rf /var/lib/apt/lists/*

RUN npm install -g npm@latest

USER node
