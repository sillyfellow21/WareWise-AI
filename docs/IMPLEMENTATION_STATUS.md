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
- Legacy API identity hardening: authenticated requests reload the current user
	role, product and profile routes enforce self-access and role checks, product
	mutations use the token identity instead of request-body identity, and access
	tokens expire after 15 minutes.
- Authorization middleware tests cover allowed roles, denied roles, and
	cross-user resource access.
- Free local runtime path: RainbowKit/WalletConnect and the hosted prediction
	dependency were removed; Wagmi injected wallets and a configurable local ML
	service are used instead. Licensing and unavoidable hosted costs are listed
	in `docs/LICENSING_AND_FREE_STACK.md`.

## Not implemented yet

- PostgreSQL connection, Prisma schema/migrations, seed data, and repositories.
- Redis connection, distributed rate limiting, queues, and scheduled jobs.
- Authentication: registration, login, short-lived access tokens, refresh-token rotation, logout, password reset, session revocation, and RBAC middleware.
- Product, supplier, inventory movement, purchase-order, payment, audit-log, and notification modules.
- API-to-ML authenticated proxy and durable forecast storage.
- Blockchain service, contract deployment scripts, confirmation reconciliation, and contract tests.
- React TypeScript migration and feature-based client modules beyond the new
	app composition foundation.
- Object storage, email delivery, observability export, OpenAPI generation, integration tests, end-to-end tests, and deployment workflow.
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

## Recommended implementation order

1. PostgreSQL/Prisma schema and migration tests.
2. Auth, sessions, RBAC, and audit logging.
3. Products, suppliers, warehouses, and immutable inventory movements.
4. Purchase orders and manager approval workflows.
5. Durable forecast runs and the authenticated ML proxy.
6. Payments and isolated blockchain reconciliation.
7. Frontend feature migration, integration tests, CI/CD, and deployment hardening.
