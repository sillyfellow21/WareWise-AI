# WareWise Security Specification

This file separates the controls the API enforces today from the controls the
product still owes. [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) tracks
the matching code status.

## Enforced today

- Helmet security headers, plus a cross-origin resource policy that permits the
  avatar `<img>` requests the client makes.
- A strict CORS allowlist read from `CORS_ORIGINS` (no wildcard) with credentials
  enabled.
- A 1 MB JSON body limit and a disabled `x-powered-by` header.
- A request ID on every request, echoed in error payloads and access logs.
- Structured access logs containing only request id, method, path, status and
  duration. No headers, cookies, bodies or credentials are ever written.
- In-process rate limiting: 120 requests per minute per client IP, with
  `x-ratelimit-limit` / `x-ratelimit-remaining` headers and a `429` payload.
- bcrypt password and security-answer hashing (cost 10).
- Parameterized Prisma queries only, with an allowlist of sortable product fields
  (`sortFields` in `products.controller.ts`).
- Bearer-token authentication on protected routes via `verifyToken`.
- Secrets supplied only through environment variables. The API refuses to start
  in production without `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.

## Known gaps (documented, not enforced)

- **Access tokens never expire.** `signToken` issues a JWT with no `expiresIn`,
  so a leaked token stays valid until the signing secret is rotated.
- **Ownership is not enforced.** `createProduct`, `bookProduct` and
  `deleteProduct` take the acting user from the request body or URL instead of the
  authenticated token, so any signed-in user can act as another user.
  `updateProduct` performs no ownership check at all. `verifyToken` does set
  `response.locals.userId`; no controller consumes it yet.
- **No refresh sessions.** `JWT_REFRESH_SECRET` is required in production but
  unused; there is no refresh, logout or revocation.
- **No schema validation.** Request bodies are coerced by hand (`asString`,
  `toNumber`) instead of validated against a schema.
- **No RBAC.** No role checks; every account has the same permissions.
- **No session cookies.** The token is returned in the JSON body and held in
  Redux (`redux-persist`), not in an HTTP-only, SameSite cookie.
- **No idempotency keys** on payment or order side effects; no payment module
  exists yet.

## Threat priorities
Account takeover, broken object-level authorization, inventory tampering, duplicate payments, leaked secrets, malicious uploads, and forecast-driven unauthorized purchasing.

## Incident response
Rotate exposed credentials immediately, revoke sessions, preserve audit/request logs, disable affected integrations, and document the incident.

### Demo credentials
The seven demo logins in [Readme.md](../Readme.md) are published deliberately:
`server/src/db/seed.ts` seeds exactly those accounts into a throwaway demo
database that Render deletes after 30 days. Treat them as public — never re-use a
demo password for a real account, and never put real or personal data behind them.
Any credential that was ever genuine still has to be rotated and treated as
compromised.
