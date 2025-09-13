FROM node:24.5.0-alpine AS base

WORKDIR /usr/src/app


FROM base AS deps

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci 


FROM base AS builder

COPY --from=deps /usr/src/app/node_modules ./node_modules
# Copy configuration files first
COPY next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs next-env.d.ts ./
COPY package.json package-lock.json ./
# Copy source code
COPY src ./src
COPY public ./public

# Ensure we have the right permissions
RUN chmod +x node_modules/.bin/* || true

# Set environment for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Run build
RUN npm run build

FROM base AS development

ENV NODE_ENV=development
COPY --from=deps /usr/src/app/node_modules ./node_modules

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]


FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev 

FROM base AS production
ENV NODE_ENV=production
USER node

COPY --chown=node:node --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder   /usr/src/app/.next        ./.next
COPY --chown=node:node --from=builder   /usr/src/app/public       ./public
COPY --chown=node:node --from=builder   /usr/src/app/next.config.ts ./
COPY --chown=node:node --from=builder   /usr/src/app/package.json ./

EXPOSE 3000

CMD ["npm", "run", "start"]
