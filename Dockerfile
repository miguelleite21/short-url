FROM node:23.9.0-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .
RUN yarn build

FROM node:23.9.0-alpine
WORKDIR /app

COPY package*.json ./
RUN yarn install --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY tsconfig.json ./tsconfig.json
COPY mikro-orm.config.* ./
CMD ["node", "dist/main"]
