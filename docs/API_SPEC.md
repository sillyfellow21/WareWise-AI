# WareWise API Specification

Base path: `/api/v1`. JSON responses use `{ data }` for success and `{ error: { code, message, requestId, details? } }` for failures.

## Health
- `GET /health` liveness.
- `GET /ready` dependency readiness.
- `GET /metrics` restricted operational metrics.

## Authentication
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/password-reset/request`
- `POST /auth/password-reset/confirm`

Access tokens are short-lived. Refresh tokens are rotated, stored hashed, and delivered in secure HTTP-only cookies in browser deployments.

## Inventory and products
- `GET /products`
- `POST /products` supplier only.
- `PATCH /products/:productId` supplier/admin only.
- `GET /warehouses/:warehouseId/inventory`
- `POST /warehouses/:warehouseId/inventory/movements` manager/employee with policy checks.

## Orders and payments
- `POST /purchase-orders`
- `GET /purchase-orders`
- `POST /purchase-orders/:id/approve` manager/admin only.
- `POST /purchase-orders/:id/cancel`
- `POST /payments/:id/confirm` internal/provider callback only.

## Forecasting
- `POST /forecast` manager/admin only; proxies a validated request to ML.
- `GET /products/:productId/forecasts`
- `POST /forecasts/:id/approve-reorder` manager only.

Every mutating endpoint accepts `Idempotency-Key` where retries can create side effects. Pagination is cursor-based and every list endpoint declares sort order.
