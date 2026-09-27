from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

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
