# CarePulse Hospital Management System

CarePulse is a full-stack hospital operations platform. The repository is split into a Vite React client and an Express, Prisma, PostgreSQL API.

## Repository Layout

- `client/` React, Vite, React Router, Axios, React Hook Form, Recharts, and Lucide UI
- `server/` Express REST API, JWT authentication, Prisma ORM, PostgreSQL schema, and seed utilities
- `server/prisma/` schema and migrations
- `.env.example` development environment template

## Current Foundation

The existing foundation includes JWT login and registration, bcrypt password hashing, Helmet, CORS, rate limiting, centralized errors, Prisma models for identity, patients, appointments, clinical records, diagnostics, pharmacy, admissions, billing, notifications, and audit logs.

Implementation is being completed in controlled phases. Existing work in the client and server is preserved while modules are expanded behind the current API boundaries.

## Requirements

- Node.js 20+
- PostgreSQL 14+
- npm

## Setup

1. Install dependencies:

   ```powershell
   Push-Location client; npm install; Pop-Location
   Push-Location server; npm install; Pop-Location
   ```

2. Copy `.env.example` to the environment files used by your local setup. Put the server values in `server/.env` and expose only `VITE_API_URL` from the client environment.

3. Apply the Prisma schema:

   ```powershell
   Push-Location server
   npx prisma migrate deploy
   npx prisma generate
   Pop-Location
   ```

4. Start the API and client in separate terminals:

   ```powershell
   Push-Location server; npm run dev; Pop-Location
   Push-Location client; npm run dev; Pop-Location
   ```

The API health check is available at `http://localhost:5000/api/v1/health`. The Vite app runs at `http://localhost:5173`.

## Quality Checks

```powershell
Push-Location client; npm run lint; npm run build; Pop-Location
Push-Location server; npm run prisma:validate; Pop-Location
```

Development credentials are documented only when the seed workflow is finalized. Never commit real database URLs, JWT secrets, or patient data.
