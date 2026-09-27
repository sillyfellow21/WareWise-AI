# WareWise Database Schema

PostgreSQL is the target system of record. IDs are opaque UUIDs. All timestamps are UTC. Monetary values are integer minor units with an explicit ISO currency.

## Core entities
- `User(id, email, passwordHash, role, status, createdAt, updatedAt)`
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

## Invariants
- `currentQuantity` is derived from movements and may be cached, never silently mutated.
- `reservedQuantity >= 0` and `reservedQuantity <= currentQuantity`.
- Inventory writes use optimistic locking and append a movement in the same transaction.
- Purchase order totals are recalculated server-side.
- Payment and blockchain callbacks require idempotency keys.
- Audit logs are append-only to application roles.
