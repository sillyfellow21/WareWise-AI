from datetime import datetime, timezone

import math

from fastapi import APIRouter, HTTPException, Query

from app.schemas.forecast import ForecastBatchRequest, ForecastRequest, ForecastResponse
from app.services.forecasting import forecast_demand

router = APIRouter(tags=["forecasting"])
latest_forecasts: dict[str, ForecastResponse] = {}


@router.post("/forecast", response_model=ForecastResponse)
def forecast(request: ForecastRequest) -> ForecastResponse:
    result = forecast_demand(request)
    response = ForecastResponse(
        **result,
        productId=request.productId,
        generatedAt=datetime.now(timezone.utc),
    )
    latest_forecasts[request.productId] = response
    return response


@router.post("/forecast/batch", response_model=list[ForecastResponse])
def forecast_batch(request: ForecastBatchRequest) -> list[ForecastResponse]:
    generated_at = datetime.now(timezone.utc)
    responses = [
        ForecastResponse(
            **forecast_demand(item),
            productId=item.productId,
            generatedAt=generated_at,
        )
        for item in request.items
    ]
    latest_forecasts.update({item.productId: item for item in responses})
    return responses


@router.get("/forecast/{product_id}", response_model=ForecastResponse)
def latest_forecast(product_id: str) -> ForecastResponse:
    response = latest_forecasts.get(product_id)
    if response is None:
        raise HTTPException(status_code=404, detail="No forecast exists for this product")
    return response


@router.get("/forecast/monthly")
def monthly_forecast(
    month: int = Query(ge=1, le=12),
    year: int = Query(ge=2000, le=2100),
) -> dict[str, float | int]:
    """Return a local baseline for the legacy monthly chart until model storage exists."""
    seasonal_factor = 1 + 0.15 * math.sin(((month - 1) / 12) * math.tau)
    baseline = (120, 80, 100, 60)
    return {
        "year": year,
        "month": month,
        **{
            f"P{index}": round(value * seasonal_factor, 2)
            for index, value in enumerate(baseline, start=1)
        },
    }
