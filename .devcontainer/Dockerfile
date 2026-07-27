FROM node:26-bookworm

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        ca-certificates \
        curl \
        git \
        xvfb \
        x11vnc \
        fluxbox \
        && rm -rf /var/lib/apt/lists/*

RUN npm install -g npm@latest

ENV DISPLAY=:99

USER node
