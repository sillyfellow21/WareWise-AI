# WareWise Product Specification

## Purpose
WareWise helps warehouse teams buy, receive, store, and replenish inventory using supplier marketplace data and demand forecasts.

## Users and roles
Target design. The code today stores only the strings `supplier` and `employee` in
`User.role` (`server/prisma/schema.prisma`) and performs **no role check** — see
[SECURITY_SPEC.md](SECURITY_SPEC.md).

- `ADMIN`: manages tenants, users, and system configuration.
- `WAREHOUSE_MANAGER`: approves replenishment, manages inventory, and reviews forecasts.
- `EMPLOYEE`: browses products, creates purchase requests, and records operational activity.
- `SUPPLIER`: manages supplier products and fulfills approved orders.

## Core workflows
Target design. The app implements sign-in, product listing, booking and the
prediction chart. Steps 3-8 are not built, and step 1 currently issues a
non-expiring token with no refresh session.

1. A user authenticates and receives a short-lived access token plus a refresh session.
2. Suppliers publish products with price, availability, and lead time.
3. Warehouse staff receive stock; every quantity change creates an immutable inventory movement.
4. Employees create purchase orders from marketplace products.
5. Managers approve, reject, or cancel purchase orders.
6. The forecasting service produces a demand estimate, confidence, and reorder recommendation.
7. A manager explicitly approves a recommendation before a purchase order is created.
8. Payments may settle through a blockchain adapter, but order state remains authoritative in the database.

## Non-goals for the first release
- Autonomous purchasing.
- Custody of user funds or private keys.
- Multi-region active-active deployment.
- Replacing human approval for inventory adjustments.

## Acceptance criteria
- All inventory changes are attributable and auditable.
- Authorization is enforced server-side for every protected operation.
- Forecasts are advisory and include model version, generated time, confidence, and input range.
- Payment callbacks are idempotent and cannot alter order ownership.
