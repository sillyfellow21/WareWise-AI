# WareWise Deployment Specification

## Environments
Local Docker Compose, shared staging, and production. Each environment has separate databases, object storage, Redis, signing keys, and blockchain configuration.

## Runtime
- React static assets served by a CDN or web server.
- API and ML containers run as non-root users with health checks.
- PostgreSQL uses managed backups and migrations run as a controlled release step.
- Redis is private-network only.
- Object storage is private by default; clients receive short-lived signed URLs.

## Delivery gates
Pull requests run formatting, linting, type checks, unit tests, integration tests, contract tests, and container builds. Deployment requires a successful main-branch build, migration review, and rollback plan.

## Observability
Structured JSON logs include request ID, route, status, and duration. Alerts cover error rate, latency, failed jobs, database connectivity, queue depth, forecast failures, and payment reconciliation lag.
