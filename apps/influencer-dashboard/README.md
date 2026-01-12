# Influencer Dashboard

A Next.js dashboard for influencers to manage their performance, earnings, and affiliate campaigns.

## Features

- 📊 Performance analytics and metrics
- 💰 Earnings tracking and payout management
- 🔗 Affiliate link generation and management
- 📈 Click and conversion tracking
- 🎯 Attribution analytics
- 👤 Profile and settings management

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running on port 5000
- Firebase project configured

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your configuration

# Run development server
npm run dev
```

The dashboard will be available at [http://localhost:3002](http://localhost:3002)

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Firebase Auth
- **Charts:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── context/         # Context providers
├── lib/             # Utility functions and configurations
└── types/           # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server (port 3002)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

See `.env.local.example` for required environment variables.

## Port Configuration

This dashboard runs on port **3002** to avoid conflicts with:

- Web frontend (port 3000)
- Business dashboard (port 3001)
- Backend API (port 5000)
