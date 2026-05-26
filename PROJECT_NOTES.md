# Ocean Weligama

A full-stack hotel and tourism website for Ocean Weligama — a beachside boutique property in Weligama, Sri Lanka.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/ocean-weligama run dev` — run the frontend (port 19003)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 (port 8080, routes at `/api/v1/...`)
- DB: PostgreSQL + Drizzle ORM
- Frontend: React + Vite, wouter routing, Tailwind CSS, shadcn/ui, framer-motion
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/ocean-weligama/` — React frontend (Vite)
- `artifacts/api-server/` — Express 5 backend
- `lib/db/src/schema/` — Drizzle ORM schema (source of truth)
- `lib/api-spec/` — OpenAPI spec
- `lib/api-client-react/src/generated/` — auto-generated React Query hooks
- `artifacts/ocean-weligama/src/pages/` — all public pages
- `artifacts/ocean-weligama/src/pages/admin/` — admin panel pages

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → typed React Query hooks
- JWT auth for admin panel; token stored in localStorage as `ow-admin-token`
- Admin panel at `/ow-admin` (obscure path for security)
- Express params cast as `Record<string, string>` to satisfy Express 5 strict typing
- All routes prefixed `/api/v1/` inside the router; Express mounts router at `/api`

## Product

- **Public site**: Home, Rooms (filterable), Room Detail, Services, Service Detail, Gallery, About, Contact
- **Booking flow**: 3-step (Room + Dates → Guest Details → Review & Confirm)
- **Admin panel** at `/ow-admin`: Dashboard with charts, Bookings, Rooms, Services, Reviews, Messages, Pricing
- **5 room types**: Ocean View Room, Beach Villa, Surfer Suite, Garden Room, Surf Dormitory
- **7 services**: Surf Lessons, Scooter Rental, Whale Watching, Yoga, Cooking Class, Airport Transfer, Snorkeling

## Admin credentials

- Email: `admin@oceanweligama.com`
- Password: `OceanAdmin2025!`

## User preferences

- Ocean-inspired color scheme: primary=#0B3D5E, secondary=#1A6B8A, accent=#4BBCCC, golden=#F0A500
- DM Sans for body text, Playfair Display for headings

## Gotchas

- After changing DB schema: run `pnpm --filter @workspace/db run push` then `pnpm run typecheck:libs` to rebuild declarations
- Express 5 `req.params` is typed `string | string[]` — always destructure with `as Record<string, string>`
- API server `dev` script: builds first then starts — restart workflow to pick up code changes
- Admin seed script: `node /tmp/seed-admin.mjs` (uses pnpm store bcryptjs at `node_modules/.pnpm/bcryptjs@3.0.3/...`)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

pnpm --filter @workspace/ocean-weligama run dev

pnpm --filter @workspace/api-server run dev

Email: <admin@oceanweligama.com>
Password: OceanAdmin2025!

lsof -ti :8080 | xargs kill -9

