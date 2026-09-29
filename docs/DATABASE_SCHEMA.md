# WareWise Database Schema

## What exists today

`server/prisma/schema.prisma` defines **two models**. IDs are **`cuid()` strings**,
not UUIDs, and money and quantities are **floating point**, not integer minor
units. The `User` model mirrors the retired Mongoose document so the React client
(which reads `_id`, `picturePath`, `phoneNumber`, …) keeps working; controllers map
`id` to `_id` in `src/lib/serialize.ts`.

### User
`id, firstName, lastName, email (unique), password (bcrypt), picturePath,
pictureData (data URI, optional), role, location, employeeId, supplierId,
phoneNumber, securityQuestion, securityAnswer, createdAt, updatedAt`

`role` is a free-form string. The seed writes only `supplier` and `employee`, and
nothing enforces it — see [SECURITY_SPEC.md](SECURITY_SPEC.md).

### Product
`id, userId, name, description, price, quantity, minQuantity, reorderPoint,
maxQuantity, status, category, bookings (JSON), createdAt, updatedAt`

`bookings` is a JSON object keyed by user id, mirroring the legacy
`Map<String, Boolean>`. There is a `@@index([userId])`; nothing else is indexed.

No supplier, warehouse, inventory, movement, order, payment, forecast or audit-log
table exists.

## The target model (not implemented)

PostgreSQL is the system of record, all timestamps UTC, and the design calls for
opaque IDs and integer minor units with an explicit ISO currency.

- `Supplier(id, userId, legalName, status)`
- `Warehouse(id, name, timezone, status)`
- `Category(id, name, status)`
- `Product(id, supplierId, categoryId, sku, name, description, unitPriceMinor, currency, leadTimeDays, status)`
- `Inventory(id, warehouseId, productId, currentQuantity, reservedQuantity, reorderPoint, version)`
- `InventoryMovement(id, inventoryId, type, quantityDelta, referenceType, referenceId, actorId, reason, createdAt)`
- `PurchaseOrder(id, supplierId, warehouseId, status, currency, totalMinor, createdBy, approvedBy, approvedAt)`
- `PurchaseOrderItem(id, purchaseOrderId, productId, quantity, unitPriceMinor)`
- `Payment(id, purchaseOrderId, status, amountMinor, currency, provider, idempotencyKey)`
- `BlockchainTransaction(id, paymentId, network, transactionHash, status, blockNumber)`
- `Forecast(id, productId, warehouseId, forecastRunId, horizonDays, predictedQuantity, confidence, recommendedOrderQuantity, modelVersion)`
- `ForecastRun(id, status, inputRangeStart, inputRangeEnd, startedAt, completedAt)`
- `AuditLog(id, actorId, action, entityType, entityId, metadata, requestId, createdAt)`

## Invariants (target)

- `currentQuantity` is derived from movements and may be cached, never silently mutated.
- `reservedQuantity >= 0` and `reservedQuantity <= currentQuantity`.
- Inventory writes use optimistic locking and append a movement in the same transaction.
- Purchase order totals are recalculated server-side.
- Payment and blockchain callbacks require idempotency keys.
- Audit logs are append-only to application roles.

None of these invariants is enforced yet — the code deletes and updates products
in place, with no movement or audit trail.