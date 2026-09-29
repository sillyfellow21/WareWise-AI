# WareWise ML Specification

## Service contract
- `POST /api/v1/forecast`
- `POST /api/v1/forecast/batch`
- `GET /api/v1/forecast/:productId`
- `GET /health`
- `GET /ready`

## Input
Product and warehouse identifiers, historical daily demand, horizon, current stock, reserved stock, reorder point, lead time, and model version. Inputs are schema-validated and dates are UTC.

## Output
```json
{
  "productId": "uuid",
  "forecast": 142.0,
  "confidence": 0.8,
  "recommendedOrderQuantity": 120.0,
  "reason": "Expected demand exceeds available inventory",
  "modelVersion": "baseline-v1",
  "generatedAt": "2026-09-27T00:00:00Z"
}
```

`confidence` is a formula (`0.5 + min(len(history), 30) / 100`, capped at `0.8`), not a
measured accuracy score. Forecasts are advisory; no approval step exists yet. Nothing
is persisted: the service keeps the last response per `productId` in a Python dict and
the API caches one year of monthly values in memory for 15 minutes. Durable forecast
runs are still to come — see [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md).

## Validation today
FastAPI/Pydantic rejects an empty history, negative demand, a horizon outside 1-365
days, negative stock levels, and batches above 100 items.

## Not implemented yet
Staleness cut-offs on the input date range, a confidence threshold for promotion, and
accuracy tracking (MAE/MAPE by product class) comparing a candidate model against the
baseline before it is promoted.
