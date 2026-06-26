# CivicPulse - Community Issue Resolution Platform

AI-powered civic engagement platform built with Next.js 14, Firebase, Google Maps, and Google Gemini.

## Repository

https://github.com/shivambhartiya/civicpulse

## Architecture

- Frontend: Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn-style primitives
- AI: Gemini agent modules for image analysis, routing, duplicate detection, escalation, and insights
- Database/Auth/Storage: Firebase client SDK plus Firebase Admin support for server workflows
- Maps: Google Maps via `@vis.gl/react-google-maps`
- Deployment: Docker and Cloud Build configuration for Cloud Run

## AI Agents

1. ImageAnalysisAgent - classifies issue photos and estimates severity.
2. CategorizationAgent - maps category/severity to department and SLA.
3. DuplicateDetectionAgent - maps nearby geospatial and semantic duplicate reports.
4. EscalationAgent - detects SLA breaches and creates formal notices.
5. InsightsAgent - generates weekly insights and predictive hotspots.

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Required Environment

The app expects these values for a production-like run:

- `GEMINI_API_KEY`
- Firebase web config values: `NEXT_PUBLIC_FIREBASE_*`
- Firebase Admin service account values: `FIREBASE_ADMIN_*`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- Optional `NEXT_PUBLIC_GOOGLE_MAPS_ID` for advanced marker maps
- `NEXT_PUBLIC_APP_URL` and `APP_SECRET`

`.env.local` is ignored by Git and must never be committed.

## Optional Firebase Emulators

Local emulator scripts are still available for development:

```bash
npm run firebase:emulators
```

Set `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true` only for local development.

## Useful Commands

```bash
npm run type-check
npm run build
npm run lint
```

## Deployment

The repo includes `Dockerfile` and `cloudbuild.yaml` for Cloud Run. Before deploying, create a Google Cloud/Firebase project, add the required secrets, enable Firebase services, and configure a restricted Google Maps browser key.
