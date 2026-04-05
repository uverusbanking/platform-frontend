# ─── Stage 1: Base (dependency installation) ────────────────────────────
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Copy dependency manifests first for cached installs
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy all source code (apps + shared)
COPY . .

# ─── Stage 2: Builder (build all apps) ──────────────────────────────────
FROM base AS builder

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm run build:control
RUN pnpm run build:dashboard
RUN pnpm run build:personal-web
RUN pnpm run build:corporate-web

# ─── Stage 3: Runner (slim shared runtime base) ─────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat
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
CMD ["node", "control/server.js"]

# ─── Runtime: platform-dashboard ────────────────────────────────────────
FROM runner AS platform-dashboard
COPY --from=builder /app/dashboard/public ./dashboard/public
COPY --from=builder --chown=nextjs:nodejs /app/dashboard/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/dashboard/.next/static ./dashboard/.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME="0.0.0.0"
CMD ["node", "dashboard/server.js"]

# ─── Runtime: platform-personal-web ─────────────────────────────────────
FROM runner AS platform-personal-web
COPY --from=builder /app/personal-web/public ./personal-web/public
COPY --from=builder --chown=nextjs:nodejs /app/personal-web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/personal-web/.next/static ./personal-web/.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME="0.0.0.0"
CMD ["node", "personal-web/server.js"]

# ─── Runtime: platform-corporate-web ────────────────────────────────────
FROM runner AS platform-corporate-web
COPY --from=builder /app/corporate-web/public ./corporate-web/public
COPY --from=builder --chown=nextjs:nodejs /app/corporate-web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/corporate-web/.next/static ./corporate-web/.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME="0.0.0.0"
CMD ["node", "corporate-web/server.js"]
