FROM alpine:3.20

# Install deps
RUN apk update && apk upgrade && apk add --no-cache \
    curl \
    mariadb-client \
    wget \
    git \
    gnupg \
    jq \
    redis


# Install Node.js (LTS) and npm
ARG NODE_MAJOR=20
RUN apk add --no-cache nodejs="~$NODE_MAJOR" npm

# Install Yarn Package Manager
RUN npm install --global yarn


# Install fly.io which is used for deployments and connecting to production services
RUN curl -L https://fly.io/install.sh | sh

ENV FLYCTL_INSTALL="/root/.fly"
ENV PATH="$FLYCTL_INSTALL/bin:$PATH"
