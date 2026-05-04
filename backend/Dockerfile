# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS base
WORKDIR /opt/app

FROM base AS deps
RUN apk add --no-cache python3 make g++ gcc libc6-compat vips-dev
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
RUN apk add --no-cache python3 make g++ gcc libc6-compat vips-dev
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=512"
COPY --from=deps /opt/app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
RUN apk add --no-cache vips-dev tini
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

RUN addgroup -g 1001 -S nodejs && adduser -S strapi -u 1001

COPY --from=builder --chown=strapi:nodejs /opt/app/node_modules ./node_modules
COPY --from=builder --chown=strapi:nodejs /opt/app/dist ./dist
COPY --from=builder --chown=strapi:nodejs /opt/app/package.json ./package.json
COPY --from=builder --chown=strapi:nodejs /opt/app/config ./config
COPY --from=builder --chown=strapi:nodejs /opt/app/database ./database
COPY --from=builder --chown=strapi:nodejs /opt/app/public ./public
COPY --from=builder --chown=strapi:nodejs /opt/app/src ./src
COPY --from=builder --chown=strapi:nodejs /opt/app/types ./types
COPY --from=builder --chown=strapi:nodejs /opt/app/tsconfig.json ./tsconfig.json
COPY --from=builder --chown=strapi:nodejs /opt/app/favicon.png ./favicon.png

RUN mkdir -p .tmp public/uploads && chown -R strapi:nodejs .tmp public/uploads

USER strapi
EXPOSE 1337
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npm", "run", "start"]
