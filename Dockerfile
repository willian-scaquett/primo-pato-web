
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine AS runner

RUN addgroup -g 1001 nodejs
RUN adduser -u 1001 -G nodejs -s /bin/sh -D nodejs

WORKDIR /app

USER nodejs

COPY --from=builder --chown=nodejs:nodejs /app/public ./public
COPY --from=builder --chown=nodejs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nodejs:nodejs /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]