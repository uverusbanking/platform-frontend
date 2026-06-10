# ─── Stage 1: Base (dependency installation) ────────────────────────────
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app

# Copy dependency manifests first for cached installs
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY personal-web/package.json ./personal-web/
COPY corporate-web/package.json ./corporate-web/
COPY shared/package.json ./shared/
COPY control/package.json ./control/
COPY dashboard/package.json ./dashboard/

RUN pnpm install --frozen-lockfile

# Copy all source code (apps + shared)
COPY . .

# ─── Stage 2: Builder (build all apps) ──────────────────────────────────
FROM base AS builder

ARG VITE_API_URL
ARG VITE_API_VERSION=v1
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_VERSION=$VITE_API_VERSION

RUN cd control && pnpm run build
RUN pnpm run build:dashboard
RUN pnpm run build:personal-web
RUN pnpm run build:corporate-web

# ─── Stage 3: Shared nginx + Doppler base ───────────────────────────────
FROM nginx:alpine AS nginx-doppler
RUN apk add --no-cache wget && \
    wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
    echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
    apk update && \
    apk add doppler
RUN printf 'server {\n  listen 3000;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["doppler", "run", "--", "nginx", "-g", "daemon off;"]

# ─── Runtime: platform-control (Vite SPA via nginx) ───────────────────────
FROM nginx-doppler AS platform-control
COPY --from=builder /app/control/dist /usr/share/nginx/html

# ─── Runtime: platform-dashboard (Vite SPA via nginx) ───────────────────
FROM nginx-doppler AS platform-dashboard
COPY --from=builder /app/dashboard/dist /usr/share/nginx/html

# ─── Runtime: platform-personal-web (Vite SPA via nginx) ────────────────
FROM nginx-doppler AS platform-personal-web
COPY --from=builder /app/personal-web/dist /usr/share/nginx/html

# ─── Runtime: platform-corporate-web (Vite SPA via nginx) ───────────────
FROM nginx-doppler AS platform-corporate-web
COPY --from=builder /app/corporate-web/dist /usr/share/nginx/html
