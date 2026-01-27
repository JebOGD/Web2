FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache haproxy tini
COPY etc/haproxy.cfg /etc/haproxy/haproxy.cfg
COPY etc/start.sh /start.sh
RUN chmod +x /start.sh

RUN npm install -g pnpm
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env.local ./.env.local
RUN pnpm install --prod

EXPOSE 3000

ENTRYPOINT [ "/sbin/tini", "--", "/start.sh" ]
