# Backend Deployment Guide

## Prerequisites
- Node.js 18+
- MongoDB Atlas connection string
- Environment file per stage (`.env.development`, `.env.staging`, `.env.production` based on the examples)

## Environment Variables (required)
- `NODE_ENV` (development|staging|production)
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`

## Environment Variables (optional / tunables)
- `IMAGE_CDN_BASE_URL`
- `PAYMENT_PROVIDER`
- `CLICK_COST`, `IMPRESSION_COST`
- `CACHE_RANKING_HOME_TTL`, `CACHE_RANKING_CATEGORY_TTL`, `CACHE_RANKING_SEARCH_TTL`
- `RATE_LIMIT_VIEWS_WINDOW_MS`, `RATE_LIMIT_VIEWS_MAX`
- `RATE_LIMIT_CLICKS_WINDOW_MS`, `RATE_LIMIT_CLICKS_MAX`

See the `*.example` env files for defaults per environment.

## Install
```
cd apps/backend
npm install
```

## Build
```
npm run build
```
Outputs to `dist/`.

## Run (production)
```
NODE_ENV=production npm start
```

## Run (development)
```
npm run dev
```

## Docker
Build the image:
```
docker build -t ecommerceearn-backend .
```

Run the container (example):
```
docker run --rm -p 4000:4000 \
	-e NODE_ENV=production \
	-e PORT=4000 \
	-e MONGODB_URI="<your mongodb uri>" \
	-e JWT_SECRET="<your jwt secret>" \
	ecommerceearn-backend
```

## Health Check
- `GET /health` — returns service status and DB connectivity.

## Notes
- Graceful shutdown handles SIGINT/SIGTERM and closes MongoDB connections.
- Keep secrets out of git; copy the appropriate `.env.*.example` to `.env.*` and fill values.
