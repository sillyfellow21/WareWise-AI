# Implementation Status

This file separates executable behavior from the target specifications.

## Implemented and verified

- Root repository hygiene: environment templates, ignore rules, formatting rules, Docker Compose for local PostgreSQL/Redis, and security reporting guidance.
- Typed API foundation: Express app, Helmet, strict JSON body limit, CORS allowlist, request IDs, redacted structured access/error logs, in-process request limiting, liveness, truthful configuration readiness, and a basic metrics endpoint.
- ML contract foundation: FastAPI health/readiness, validated single forecasts, batch forecasts, latest in-memory forecast lookup, and deterministic baseline recommendation logic.
- Existing React application still builds with Vite.
- Frontend composition foundation: `App`, `AppShell`, `AppRouter`, and the
	reusable protected-route component separate theme setup, routing, and access
	control responsibilities.
- Client quality baseline: generated bundles are excluded from lint, legacy
	components have explicit prop contracts, asynchronous effects declare their
	dependencies, and the full client lint now passes with zero errors or
	warnings.
- Render Blueprint deployment definition: `render.yaml` provisions the client
	static site, the typed Node API, the FastAPI forecasting service, Render
	Postgres, and Render Key Value with generated secrets, internal database and
	Key Value wiring, free-plan-appropriate plans, and platform health checks.
	The API now serves `GET /api/health`, both application services read the
	platform `PORT` and bind `0.0.0.0`, and the client resolves its API origin
	from `VITE_API_BASE_URL`.
- PostgreSQL via Prisma: schema (`server/prisma/schema.prisma`), build-time
	`prisma db push` in the Blueprint, lazy client, and an idempotent boot seed
	(the seven demo accounts plus marketplace listings documented in the README).
- Auth, users, and products on the typed API, speaking the legacy route
	shapes the deployed React client expects: multipart registration with
	avatar storage, login with JWT, forgot-password (security question)
	flow, profile read/patch, paginated/sorted/filtered product feeds,
	owner and booked product lists, product detail, create, booking toggle,
	delete, and `/assets/*` avatar serving. Ownership is **not** actually
	enforced: the acting user is read from the request body or URL rather than
	the token, so any signed-in user can act as another user
	(see `docs/SECURITY_SPEC.md`).
- `GET /predictMonthly` compatibility endpoint: batches a year of forecasts
	against the ML service (cached, with a deterministic local fallback), so
	the deployed predictions page renders without the retired hackathon host.
- All client API call sites resolve through `VITE_API_BASE_URL`
	(`client/src/config/api.js`); no retired hosts remain in the SPA.

## Not implemented yet

- Refresh-token rotation, session revocation, and RBAC middleware (login issues a
	stateless JWT; every demo role shares the same permissions).
- Redis connection, distributed rate limiting, queues, and scheduled jobs.
- Inventory movement, purchase-order, payment, audit-log, and notification modules.
- Durable forecast storage (the ML service keeps forecasts in memory; the API
	caches a year of monthly series for 15 minutes).
- Blockchain service, contract deployment scripts, confirmation reconciliation, and contract tests.
- React TypeScript migration and feature-based client modules beyond the new
	app composition foundation.
- Object storage, email delivery, observability export, OpenAPI generation, integration tests, end-to-end tests, and deployment workflow beyond the Render Blueprint.
- Trained forecasting models, historical-data validation, model evaluation, and model registry.

## Required owner actions

1. Provision separate staging and production PostgreSQL, Redis, object storage, email, ML, and blockchain resources.
2. Generate unique production secrets for `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, database credentials, provider keys, and blockchain signer infrastructure. Never send them in chat or commit them.
3. Rotate any credentials that were ever exposed in the old README or repository history.
4. Decide the production database provider, cloud region, supported blockchain network, payment provider, email provider, and object-storage provider.
5. Confirm business rules: tenant boundaries, warehouse transfer permissions, approval limits, currencies, tax handling, return flows, and supplier settlement rules.
6. Provide representative non-sensitive historical sales data and define forecast accuracy and approval thresholds.
7. Create GitHub repository secrets and enable branch protection requiring CI, review, and successful migrations.
8. Run `docker compose up -d postgres redis`, then replace local values with real staging values before integration testing.
9. Apply `render.yaml` in the Render Dashboard, confirm the service names still match the `VITE_API_BASE_URL` and `CORS_ORIGINS` values, and replace the free compute plans before serving real traffic.

## Recommended implementation order

1. PostgreSQL/Prisma schema and migration tests.
2. Auth, sessions, RBAC, and audit logging.
3. Products, suppliers, warehouses, and immutable inventory movements.
4. Purchase orders and manager approval workflows.
5. Durable forecast runs and the authenticated ML proxy.
6. Payments and isolated blockchain reconciliation.
7. Frontend feature migration, integration tests, CI/CD, and deployment hardening.
