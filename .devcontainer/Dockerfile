FROM alpine:latest

# Set environment variables for Fly.io before installing it
ENV FLYCTL_INSTALL="/root/.fly"
ENV PATH="$FLYCTL_INSTALL/bin:$PATH"

# Install core dependencies in a single apt-get install command
# This minimizes the number of layers and helps keep the image size down.
RUN echo "Starting core dependency installation at $(date)" && \
    /usr/bin/time -v -o /dev/stderr apt-get update && \
    /usr/bin/time -v -o /dev/stderr apt-get install -y --no-install-recommends \
        curl \
        mariadb-client \
        wget \
        git \
        gnupg \
        jq \
        redis-tools \
    # Clean up apt cache to keep the image small
    && /usr/bin/time -v -o /dev/stderr rm -rf /var/lib/apt/lists/* \
    && echo "Finished core dependency installation at $(date)"

# Install Node.js using NodeSource (as per your original method)
# This ensures you get the specific Node.js version from NodeSource's repository.
ARG NODE_MAJOR=20
RUN echo "Starting Node.js installation at $(date)" && \
    /usr/bin/time -v -o /dev/stderr mkdir -p /etc/apt/keyrings && \
    /usr/bin/time -v -o /dev/stderr curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    /usr/bin/time -v -o /dev/stderr echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    /usr/bin/time -v -o /dev/stderr apt-get update && \
    /usr/bin/time -v -o /dev/stderr apt-get install -y --no-install-recommends nodejs && \
    /usr/bin/time -v -o /dev/stderr rm -rf /var/lib/apt/lists/* \
    && echo "Finished Node.js installation at $(date)"

# Install Yarn Package Manager globally
RUN echo "Starting Yarn installation at $(date)" && \
    /usr/bin/time -v -o /dev/stderr npm install --global yarn \
    && echo "Finished Yarn installation at $(date)"

# Install fly.io CLI
RUN echo "Starting Fly.io CLI installation at $(date)" && \
    /usr/bin/time -v -o /dev/stderr curl -L https://fly.io/install.sh | sh \
    && echo "Finished Fly.io CLI installation at $(date)"