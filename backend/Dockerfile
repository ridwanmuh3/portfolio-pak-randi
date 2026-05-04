# syntax=docker/dockerfile:1.7

FROM node:24-alpine AS base
WORKDIR /opt/app

# =========================
# DEPENDENCIES
# =========================
FROM base AS deps
RUN apk add --no-cache python3 make g++ gcc libc6-compat vips-dev
COPY package.json package-lock.json ./
RUN npm ci

# =========================
# BUILD
# =========================
FROM base AS builder
RUN apk add --no-cache python3 make g++ gcc libc6-compat vips-dev
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=2048"

COPY --from=deps /opt/app/node_modules ./node_modules
COPY . .

RUN npm run build

# 🔥 PRUNE devDependencies
RUN npm prune --omit=dev

# =========================
# RUNTIME (LEAN)
# =========================
FROM node:24-alpine AS runner
RUN apk add --no-cache vips tini

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

WORKDIR /opt/app

RUN addgroup -g 1001 -S nodejs && adduser -S strapi -u 1001

COPY --from=builder --chown=strapi:nodejs /opt/app/node_modules ./node_modules
COPY --from=builder --chown=strapi:nodejs /opt/app/dist ./dist
COPY --from=builder --chown=strapi:nodejs /opt/app/package.json ./package.json
COPY --from=builder --chown=strapi:nodejs /opt/app/config ./config
COPY --from=builder --chown=strapi:nodejs /opt/app/database ./database
COPY --from=builder --chown=strapi:nodejs /opt/app/public ./public

# 🔥 Optional (kalau TS tidak dipakai runtime)
# COPY --from=builder /opt/app/src ./src
# COPY --from=builder /opt/app/types ./types

RUN mkdir -p .tmp public/uploads && chown -R strapi:nodejs .tmp public/uploads

USER strapi

EXPOSE 1337
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/server.js"]