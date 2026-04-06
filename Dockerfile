# ─── Stage 1: Base (dependency installation) ────────────────────────────
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Copy dependency manifests first for cached installs
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY personal-web/package.json ./personal-web/

RUN pnpm install --frozen-lockfile

# Copy all source code (apps + shared)
COPY . .

# ─── Stage 2: Builder (build all apps) ──────────────────────────────────
FROM base AS builder

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN pnpm run build:control
RUN pnpm run build:dashboard
RUN pnpm run build:personal-web
RUN pnpm run build:corporate-web

# ─── Stage 3: Runner (slim shared runtime base) ─────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat
# Install Doppler CLI via Alpine package repository
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
    echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
    apk update && \
    apk add doppler
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
ENV NODE_ENV=production

# ─── Runtime: platform-control ──────────────────────────────────────────
FROM runner AS platform-control
COPY --from=builder /app/control/public ./control/public
COPY --from=builder --chown=nextjs:nodejs /app/control/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/control/.next/static ./control/.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME="0.0.0.0"
CMD ["doppler", "run", "--", "node", "control/server.js"]

# ─── Runtime: platform-dashboard ────────────────────────────────────────
FROM runner AS platform-dashboard
COPY --from=builder /app/dashboard/public ./dashboard/public
COPY --from=builder --chown=nextjs:nodejs /app/dashboard/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/dashboard/.next/static ./dashboard/.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME="0.0.0.0"
CMD ["doppler", "run", "--", "node", "dashboard/server.js"]

# ─── Runtime: platform-personal-web (Vite SPA via nginx) ────────────────
FROM nginx:alpine AS platform-personal-web
# Install Doppler CLI
RUN apk add --no-cache wget && \
    wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
    echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
    apk update && \
    apk add doppler
# Copy built static assets from builder
COPY --from=builder /app/personal-web/dist /usr/share/nginx/html
# SPA fallback: serve index.html for all routes
RUN printf 'server {\n  listen 3000;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]

# ─── Runtime: platform-corporate-web ────────────────────────────────────
FROM runner AS platform-corporate-web
COPY --from=builder /app/corporate-web/public ./corporate-web/public
COPY --from=builder --chown=nextjs:nodejs /app/corporate-web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/corporate-web/.next/static ./corporate-web/.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME="0.0.0.0"
CMD ["doppler", "run", "--", "node", "corporate-web/server.js"]
