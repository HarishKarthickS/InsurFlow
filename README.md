# InsurFlow

Local demo of a medical-claims workflow: insurers review a queue, providers submit claims, and a seed database fills in sample orgs, users, and cases.

This is a Next.js 15 App Router monolith (Auth.js, MongoDB/Mongoose, Tailwind). It is **not** a production SaaS, a “perfect” stack, or a live insurance product.

## What exists in the repo

- **Auth and roles:** credentials login/register; roles include admin, manager, adjuster, provider admin/staff.
- **Insurer workspace:** dashboard, claim queue, claim detail with an audit trail, team invite, org settings (policy rules), reports CSV export, payout marking, manual claim entry, ingest API docs page.
- **Provider workspace:** dashboard, claim submit, payouts list.
- **Risk flags:** heuristic checks (amount thresholds + org policy category/limit vs description text). Not a fraud ML model.
- **Bill extraction (optional):** `POST /api/v1/extract` uses Gemini when `GEMINI_API_KEY` is set (PDF text first, vision fallback). Without a key, that path fails.
- **Claim ingest API:** `POST /api/v1/ingest/claim` for the seeded org API key.
- **Payouts:** settlement writes a generated reference string; there is no real bank integration.
- **Storage:** local uploads by default; optional Supabase helpers if you configure those env vars.
- **Realtime (optional):** a separate Socket.IO process (`npm run socket` / `dev:all`).
- **Docker:** app + MongoDB via `docker-compose.yml`. Seed with `npm run seed` (or `docker-compose exec app npm run seed`).

Ad-hoc Socket.IO / Supabase smoke scripts live in `scripts/` (not the Next.js `src/` tree).

## What this is not

- Not multi-region enterprise infrastructure, live bank settlement, or an immutable compliance ledger.
- Demo accounts are **local development only**. Re-seed after pulling password changes.

## Run locally

1. Create a `.env` in the repo root (not committed). Typical keys:

```env
MONGODB_URI=mongodb://localhost:27017/claims-management
AUTH_SECRET=generate-a-local-secret
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
STORAGE_TYPE=local
```

Docker Compose sets `MONGODB_URI` to `mongodb://mongodb_container:27017/claims-management` and publishes Mongo on host port **27018**.

2. Start:

```bash
docker-compose up --build -d
# or: npm install && npm run dev
```

3. Seed:

```bash
docker-compose exec app npm run seed
# or, against local Mongo: npm run seed
```

4. Open [http://localhost:3000](http://localhost:3000).

## Demo accounts (DEV ONLY)

Password for all seeded users: `InsurFlowDev!2026`  
Documented and shown on the login page as a **local-only** value. Do not reuse it anywhere real. Team invites in this demo also set that same password.

| Role | Email |
| --- | --- |
| Insurance admin | `admin@insurflow.com` |
| Manager | `manager@insurflow.com` |
| Adjuster | `adjuster@insurflow.com` |
| Hospital admin | `admin@citygeneral.com` |
| Provider staff | `staff@citygeneral.com` |

## Repo

[HarishKarthickS/InsurFlow](https://github.com/HarishKarthickS/InsurFlow)
