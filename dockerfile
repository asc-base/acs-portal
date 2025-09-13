FROM node:24.5.0-alpine AS base

WORKDIR /usr/src/app

FROM base AS builder

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM base AS production

COPY --from=builder /usr/src/app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /usr/src/app/.next ./.next

EXPOSE 3000

CMD [ "npm","start" ]