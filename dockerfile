FROM node:24.5.0-alpine AS base

WORKDIR /usr/src/app

FROM base AS builder

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY . .

FROM base AS production

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app .

EXPOSE 3000

CMD [ "npm","start" ]