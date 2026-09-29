# WareWise Deployment Specification

## Environments
Local Docker Compose, shared staging, and production. Each environment has separate databases, object storage, Redis, signing keys, and blockchain configuration.

## Render Blueprint
`render.yaml` provisions the whole monorepo in one sync:

| Resource | Type | Root | Notes |
| --- | --- | --- | --- |
| `warewise-client` | Static site (CDN) | `client` | Vite build, SPA rewrite to `/index.html`, long-lived asset caching |
| `warewise-api` | Node web service | `server` | `npm run build:typed` then `start:typed`, health check `/api/health` |
| `warewise-ml` | Python web service | `ml-service` | uvicorn on `0.0.0.0:$PORT`, health check `/health` |
| `warewise-db` | Render Postgres 16 | - | Internal-only IP allow list, no public access |
| `warewise-cache` | Render Key Value | - | Internal-only IP allow list, Redis-compatible |

### Configuration wiring
- `DATABASE_URL` comes from `fromDatabase`, so the API receives the internal connection string for the database's region.
- `REDIS_URL` comes from `fromService` on the Key Value instance (`connectionString`).
- `ML_SERVICE_URL` comes from `fromService` on the ML service (`host`). The API adds the scheme: `https://` for dotted public hosts and `http://` for undotted private addresses.
- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are generated on the first sync and preserved afterwards.
- `VITE_API_BASE_URL` (client build) and `CORS_ORIGINS` (API) name the deployed service URLs. Update the matching `value:` entries in `render.yaml` if a service is renamed or a custom domain is attached.
- Keep every resource in the same region; private networking only works within a region.
- Validate edits with the Render CLI (`render blueprints validate`) before syncing.

### Port binding
Both application services read the platform-assigned port and bind all interfaces:
- Node: `PORT`, falling back to `API_PORT`, with `app.listen(port, '0.0.0.0')`.
- Python: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`; `ml-service/Dockerfile` uses `${PORT:-8000}`.

### Health check endpoints
Render cancels a deploy that does not pass health checks within 15 minutes and restarts instances that keep failing. Both health endpoints stay dependency-free:
- API: `GET /api/health` returns `200` with `{ data: { status: 'ok' } }`. Dependency state lives at `/ready`.
- ML: `GET /health` returns `200`.

### Free plan limits
- Free web services spin down after 15 minutes without inbound traffic; the next request pays a cold start of about a minute.
- Free web services can send but not receive private-network traffic, so the API reaches the ML service over its public HTTPS URL. Upgrading both to paid plans and switching the ML service to `type: pserv` enables the private address.
- Free Postgres expires 30 days after creation and has no backups or managed connection pooling.
- Free Key Value is in-memory only and can restart without notice, losing its data.
- Free instances are suitable for demos and review, not production.

## Runtime
- React static assets served by a CDN or web server.
- API and ML containers run as non-root users with health checks.
- Production PostgreSQL is expected to use managed backups; the free plan used here has
  none. There is no migration step: the Blueprint applies the schema with
  `npx prisma db push` at build time.
- Redis is private-network only.
- Object storage is private by default; clients receive short-lived signed URLs.

## Delivery gates
**No CI is configured.** There is no repository workflow, so nothing runs on pull
requests. Quality is enforced by running the local commands in
[../CONTRIBUTING.md](../CONTRIBUTING.md) (`make install lint test build`) and by the
Render build, which runs `npm ci`, `prisma db push` and `tsc` for the API. Continuous
integration, contract tests, container builds and a review gate are still to come.

## Observability
Structured JSON logs include request ID, route, status, and duration. Alerts cover error rate, latency, failed jobs, database connectivity, queue depth, forecast failures, and payment reconciliation lag.
