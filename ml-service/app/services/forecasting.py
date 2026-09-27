from statistics import mean

from app.schemas.forecast import ForecastRequest


def forecast_demand(request: ForecastRequest) -> dict[str, float | str]:
    daily_average = mean(point.quantity for point in request.history)
    predicted = round(daily_average * request.horizonDays, 2)
    available = max(request.currentStock - request.reservedStock, 0)
    safety_target = request.reorderPoint + daily_average * request.leadTimeDays
    recommendation = round(max(predicted + safety_target - available, 0), 2)
    confidence = round(min(0.95, 0.5 + min(len(request.history), 30) / 100), 2)

    reason = (
        "Expected demand exceeds available inventory"
        if recommendation > 0
        else "Available inventory covers the forecast horizon"
    )
    return {
        "forecast": predicted,
        "confidence": confidence,
        "recommendedOrderQuantity": recommendation,
        "reason": reason,
        "modelVersion": request.modelVersion,
    }
