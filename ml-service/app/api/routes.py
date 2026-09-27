from datetime import datetime, timezone

from fastapi import APIRouter

from app.schemas.forecast import ForecastRequest, ForecastResponse
from app.services.forecasting import forecast_demand

router = APIRouter(tags=["forecasting"])


@router.post("/forecast", response_model=ForecastResponse)
def forecast(request: ForecastRequest) -> ForecastResponse:
    result = forecast_demand(request)
    return ForecastResponse(
        **result,
        productId=request.productId,
        generatedAt=datetime.now(timezone.utc),
    )
