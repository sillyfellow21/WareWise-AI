from fastapi import FastAPI

from app.api.routes import router

app = FastAPI(title="WareWise Forecasting Service", version="0.1.0")
app.include_router(router, prefix="/api/v1")


@app.get("/health")
def health() -> dict[str, dict[str, str]]:
    return {"data": {"status": "ok"}}


@app.get("/ready")
def ready() -> dict[str, dict[str, str]]:
    return {"data": {"status": "ready"}}
