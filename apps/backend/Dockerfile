# ---- Base image ----
FROM node:18-alpine AS base
WORKDIR /app

# ---- Dependencies + build ----
FROM base AS build
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json* .npmrc* ./
RUN npm install --production=false
COPY tsconfig.json ./
COPY src ./src
COPY README_DEPLOY.md ./
RUN npm run build

# ---- Runtime ----
FROM node:18-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json package-lock.json* ./
USER app
EXPOSE 4000
CMD ["node", "dist/server.js"]
