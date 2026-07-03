FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json ./
RUN pnpm install
COPY . .
RUN pnpm exec prisma generate
RUN pnpm build

FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache python3 py3-pip
RUN pip3 install markitdown --break-system-packages
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/python ./python
COPY --from=builder /app/uploads ./uploads
ENV NODE_ENV=production
EXPOSE 4000
CMD ["sh", "-c", "npx prisma db push && node dist/index.js"]
