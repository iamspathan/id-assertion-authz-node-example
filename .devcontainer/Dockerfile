FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    mariadb-client \
    wget \
    git \
    gnupg \
    jq \
    redis-tools \
    && rm -rf /var/lib/apt/lists/*

# Install Yarn Package Manager
# RUN npm install --global yarn

# Install fly.io CLI
RUN curl -L https://fly.io/install.sh | sh

ENV FLYCTL_INSTALL="/root/.fly"
ENV PATH="$FLYCTL_INSTALL/bin:$PATH"
