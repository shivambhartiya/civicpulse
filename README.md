# CivicPulse - Community Issue Resolution Platform

AI-powered civic engagement platform built with Next.js 14, Firebase-ready local emulators, free OpenStreetMap maps, and Google Gemini.

## Local Demo

http://localhost:3000

## Architecture

- Frontend: Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn-style primitives
- AI: Gemini agent modules for image analysis, routing, duplicate detection, escalation, and insights
- Database/Auth/Storage: Firebase SDK with emulator-first local setup
- Maps: OpenStreetMap + Leaflet, no Google Cloud or paid map API required
- Deployment: Docker and optional Cloud Run files are included, but local/demo use does not require Google Cloud

## AI Agents

1. ImageAnalysisAgent - classifies issue photos and estimates severity.
2. CategorizationAgent - maps category/severity to department and SLA.
3. DuplicateDetectionAgent - checks nearby geospatial and semantic duplicates.
4. EscalationAgent - detects SLA breaches and creates formal notices.
5. InsightsAgent - generates weekly insights and predictive hotspots.

## Quick Start

    npm install
    npm run dev

Your .env.local already supports local Firebase emulator mode. Gemini uses GEMINI_API_KEY from .env.local.

## Optional Firebase Emulators

Run this in a second terminal when you want live local Auth, Firestore, and Storage instead of mock fallback data:

    npm run firebase:emulators

Emulator UI: http://127.0.0.1:4000

This uses project id demo-civicpulse and does not require a Firebase or Google Cloud account.

## Useful Commands

    npm run type-check
    npm run build
    npm run lint

## What Still Requires An Account

- Hosted Firebase production project
- Push notifications with real FCM tokens
- Cloud Run deployment

Everything else runs locally without a Google Cloud account.
