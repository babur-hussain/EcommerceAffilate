# Backend API

Clean, minimal backend API built with Node.js, TypeScript, and Express.js.

## Tech Stack

- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web framework
- **ts-node-dev** - Development server with hot reload
- **CORS** - Cross-origin resource sharing

## Project Structure

```
apps/backend/
├── src/
│   ├── server.ts          # Entry point - starts HTTP server
│   ├── app.ts             # Express app configuration
│   ├── config/
│   │   └── env.ts         # Environment variables
│   └── routes/
│       └── health.route.ts # Health check endpoint
├── package.json
└── tsconfig.json
```

## Getting Started

### Development

From the root of the monorepo:

```bash
npm run backend
```

Or from this directory:

```bash
npm run dev
```

The server will start on `http://localhost:4000` with hot reload enabled.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Available Endpoints

### Health Check

```
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-06T18:49:22.340Z",
  "service": "ecommerceearn-backend"
}
```

## Environment Variables

Create a `.env` file in this directory:

```env
PORT=4000
NODE_ENV=development
```

## Features

- ✅ TypeScript for type safety
- ✅ Hot reload with ts-node-dev
- ✅ CORS enabled for frontend integration
- ✅ Environment configuration
- ✅ Health check endpoint
- ✅ Clean project structure
- ✅ Modular routing

## Development Notes

- Changes to `.ts` files trigger automatic server restart
- CORS is enabled for all origins (configure in production)
- No database, authentication, or business logic yet (intentionally minimal)
- Ready to extend with additional routes and middleware
