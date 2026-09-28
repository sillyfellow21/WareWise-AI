# WareWise ML Specification

## Service contract
- `POST /api/v1/forecast`
- `POST /api/v1/forecast/batch`
- `GET /api/v1/forecast/:productId`
- `GET /api/v1/forecast/monthly?month=1&year=2026` legacy chart compatibility using the local baseline.
- `GET /health`
- `GET /ready`

## Input
Product and warehouse identifiers, historical daily demand, horizon, current stock, reserved stock, reorder point, lead time, and model version. Inputs are schema-validated and dates are UTC.

## Output
```json
{
  "productId": "uuid",
  "forecast": 142,
  "confidence": 0.87,
  "recommendedOrderQuantity": 120,
  "reason": "Expected demand exceeds available inventory",
  "modelVersion": "baseline-v1",
  "generatedAt": "2026-09-27T00:00:00Z"
}
```

Forecasts are advisory. A warehouse manager must approve replenishment. The API stores input range, model version, confidence, and generated output for reproducibility.

The monthly compatibility endpoint is a deterministic baseline only. It is not a trained model and must be replaced with persisted historical-data forecasts before production use.

## Quality gates
Reject missing/negative demand, stale input beyond the configured window, and confidence below the operational threshold. Track MAE/MAPE by product class and compare the baseline before promoting a model.
