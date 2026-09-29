# WareWise API Specification

## The API that exists today

The typed API in `server/src` is mounted at the **root** — there is no version
prefix (only `/api/v1/health` exists as a versioned alias). It deliberately
reproduces the legacy route shapes the React client calls.

**Response shapes differ by route.** Health and error responses use envelopes
(`{ data: … }` and `{ error: { code, message, requestId } }`). The application
routes return the flat legacy bodies the client expects, without a `data`
wrapper — for example a product feed answers
`{ error, total, page, limit, category, status, products }`.

### Health and operations
- `GET /health` · `GET /api/health` · `GET /api/v1/health` — liveness, `200` with
  `{ data: { status: 'ok' } }`.
- `GET /ready` — `200`/`503` with `{ data: { status, checks: { database, redis } } }`.
  These checks only report that the variables are *set*, not that a connection works.
- `GET /metrics` — Prometheus-style plain text uptime counter.

### Authentication
- `POST /auth/register` — multipart (field `picture`).
- `POST /auth/login`
- `POST /auth/verify-email`
- `POST /auth/reset-password-security`

Access tokens are JWTs signed with `JWT_ACCESS_SECRET`, carrying `{ id }`, sent as
`Authorization: Bearer <token>`. They are **not time-limited** and there is no
refresh, logout or revocation — see [SECURITY_SPEC.md](SECURITY_SPEC.md).
`JWT_REFRESH_SECRET` is required in production but unused.

### Users
- `GET /users/:id` — bearer token.
- `PATCH /users/:id` — bearer token.

### Products
- `GET /products` — feed, `?page&limit&sort&category&status&name`.
- `POST /products` — multipart, bearer token.
- `GET /products/:userId/products` — owner's listings.
- `GET /products/:userId/bookedproducts` — products this user booked.
- `GET /products/:productId/product` — detail.
- `PATCH /products/:productId/update` — bearer token.
- `PATCH /products/:id/booking` — bearer token, toggles a booking.
- `DELETE /products/:userId/:productId/delete` — bearer token.

Pagination is **offset based** (`page`, `limit`, default 5). `sort` accepts
`field,order` where `field` is checked against an allowlist in
`products.controller.ts` and silently falls back to `quantity` otherwise. Filters
(`category`, `status`) accept comma-separated lists; `name` is a case-insensitive
substring match. Requests are parameterized through Prisma.

### Avatars
- `GET /assets/*` — uploaded bytes, or a generated initials SVG for users without
  an image.

### Forecasting
- `GET /predictMonthly?month&year` — one month of the cached yearly series. The API
  batches a full year against the ML service and caches it in memory for 15 minutes,
  falling back to the same baseline formula locally if the ML service is unreachable.

## The target API (not implemented)

The following is the design this API is meant to grow into. **None of it exists
yet** — see [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md).

- Base path `/api/v1`, with `{ data }` for success and
  `{ error: { code, message, requestId, details? } }` for failures on every route.
- `POST /auth/refresh` and `POST /auth/logout`, with short-lived access tokens and
  rotated, hashed refresh sessions in HTTP-only cookies.
- `GET /warehouses/:warehouseId/inventory` and
  `POST /warehouses/:warehouseId/inventory/movements` with policy checks.
- `POST /purchase-orders`, `GET /purchase-orders`,
  `POST /purchase-orders/:id/approve` (manager/admin), `POST /purchase-orders/:id/cancel`.
- `POST /payments/:id/confirm` as an internal/provider callback.
- `POST /forecast` (manager/admin, proxies ML),
  `GET /products/:productId/forecasts`, `POST /forecasts/:id/approve-reorder`.
- `Idempotency-Key` on every mutating endpoint where a retry can cause a side
  effect, and cursor-based pagination with a declared sort order on every list.