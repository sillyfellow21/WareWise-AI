from datetime import datetime

from pydantic import BaseModel, Field


class DemandPoint(BaseModel):
    date: str
    quantity: float = Field(ge=0)


class ForecastRequest(BaseModel):
    productId: str = Field(min_length=1)
    history: list[DemandPoint] = Field(min_length=1, max_length=3650)
    horizonDays: int = Field(default=30, ge=1, le=365)
    currentStock: float = Field(ge=0)
    reservedStock: float = Field(default=0, ge=0)
    reorderPoint: float = Field(default=0, ge=0)
    leadTimeDays: int = Field(default=0, ge=0, le=365)
    modelVersion: str = Field(default="baseline-v1", min_length=1, max_length=64)


class ForecastBatchRequest(BaseModel):
    items: list[ForecastRequest] = Field(min_length=1, max_length=100)


class ForecastResponse(BaseModel):
    productId: str
    forecast: float
    confidence: float = Field(ge=0, le=1)
    recommendedOrderQuantity: float = Field(ge=0)
    reason: str
    modelVersion: str
    generatedAt: datetime
