# CivicPulse - Community Issue Resolution Platform

AI-powered civic engagement platform built with Next.js 14, a self-contained local data service, Google Maps, and Google Gemini.

## Repository

https://github.com/shivambhartiya/civicpulse

## Architecture

- Frontend: Next.js 14 App Router, TypeScript, Tailwind CSS
- AI: Gemini agents for image analysis, routing, duplicate detection, escalation, and insights
- Data: JSON persistence in `.civicpulse-data/civicpulse.json`
- Auth: Scrypt password hashing and signed HTTP-only session cookies
- Uploads: Validated local image storage served through `/api/uploads/*`
- Maps: Google Maps via `@vis.gl/react-google-maps`

The app seeds itself with demo civic data on first run.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000 and choose **Continue with demo profile**, or create an account.

## Environment

Only Gemini and Google Maps need external keys. The data store and authentication work without configuration.

```bash
cp .env.example .env.local
```

`APP_SECRET` is optional locally. CivicPulse generates one in its data directory when omitted.

## Persistence

Local and Docker runs persist data in a writable data directory. Cloud Run's local filesystem is ephemeral, so a future production deployment should mount persistent storage or replace the local store adapter with a managed database.

## Verification

```bash
npm run type-check
npm run build
npm run lint
```
