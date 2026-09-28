import type { RequestHandler } from 'express';
import { env } from '../../config/env.js';

/**
 * `GET /predictMonthly?month=&year=` — the legacy hackathon endpoint the
 * predictions page looped over (12 calls, one per month). Each call now
 * computes the whole year in one `POST /api/v1/forecast/batch` against the
 * live warewise-ml service (baseline model over synthetic-but-deterministic
 * daily demand history) and caches the result for 15 minutes. If the ML
 * service is unreachable the same baseline formula is applied locally so the
 * chart always renders.
 */

type SeriesKey = 'P1' | 'P2' | 'P3' | 'P4';
type MonthlyValue = Record<SeriesKey, number>;
type YearValues = Record<number, MonthlyValue>;

const SERIES: { key: SeriesKey; productId: string; base: number }[] = [
  { key: 'P1', productId: 'laptop', base: 45 },
  { key: 'P2', productId: 'coffee-cup', base: 120 },
  { key: 'P3', productId: 'wireless-headphones', base: 80 },
  { key: 'P4', productId: 'gaming-console', base: 30 },
];

// Holiday-heavy Nov/Dec, quiet Feb — mirrors the old demo chart's shape.
const SEASONALITY = [0.9, 0.85, 0.95, 1.0, 1.05, 1.0, 0.95, 1.0, 1.05, 1.1, 1.25, 1.35];

const daysInMonth = (year: number, month: number): number => new Date(year, month, 0).getDate();

const hashString = (value: string): number => {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }
  return Math.abs(hash);
};

/** Deterministic 0..1 jitter so identical requests always chart identically. */
const noise = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const historyFor = (
  series: (typeof SERIES)[number],
  year: number,
  month: number,
): { date: string; quantity: number }[] => {
  const days = daysInMonth(year, month);
  const points: { date: string; quantity: number }[] = [];
  for (let day = 1; day <= days; day += 1) {
    const jitter = 0.85 + 0.3 * noise(hashString(`${series.productId}:${year}:${month}:${day}`));
    const quantity = Math.max(1, Math.round(series.base * SEASONALITY[month - 1] * jitter));
    points.push({
      date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      quantity,
    });
  }
  return points;
};

/** Same formula as ml-service/app/services/forecasting.py (baseline-v1). */
const baselineForecast = (history: { quantity: number }[], horizonDays: number): number => {
  const average = history.reduce((sum, point) => sum + point.quantity, 0) / history.length;
  return Math.round(average * horizonDays * 100) / 100;
};

const buildFallbackYear = (year: number): YearValues => {
  const values: YearValues = {};
  for (let month = 1; month <= 12; month += 1) {
    values[month] = { P1: 0, P2: 0, P3: 0, P4: 0 };
    for (const series of SERIES) {
      const history = historyFor(series, year, month);
      values[month][series.key] = baselineForecast(history, daysInMonth(year, month));
    }
  }
  return values;
};

/** 48 items (4 series x 12 months) in one batch request. */
const callMlService = async (year: number): Promise<YearValues> => {
  const items: unknown[] = [];
  const order: { month: number; key: SeriesKey }[] = [];
  for (const series of SERIES) {
    for (let month = 1; month <= 12; month += 1) {
      items.push({
        productId: `${series.productId}-${year}-${month}`,
        history: historyFor(series, year, month),
        horizonDays: daysInMonth(year, month),
        currentStock: 0,
        reservedStock: 0,
        reorderPoint: 0,
        leadTimeDays: 0,
        modelVersion: 'baseline-v1',
      });
      order.push({ month, key: series.key });
    }
  }
  // 90s accommodates the free-tier ML cold start on the first request.
  const response = await fetch(`${env.mlServiceUrl}/api/v1/forecast/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
    signal: AbortSignal.timeout(90_000),
  });
  if (!response.ok) {
    throw new Error(`ML service responded with status ${response.status}`);
  }
  const results: unknown = await response.json();
  if (!Array.isArray(results) || results.length !== items.length) {
    throw new Error('ML service returned an unexpected batch shape');
  }
  const values: YearValues = {};
  for (let month = 1; month <= 12; month += 1) {
    values[month] = { P1: 0, P2: 0, P3: 0, P4: 0 };
  }
  results.forEach((result, index) => {
    const { month, key } = order[index];
    const forecast = Number((result as { forecast?: unknown }).forecast);
    if (!Number.isFinite(forecast)) {
      throw new Error('ML service returned a non-numeric forecast');
    }
    values[month][key] = forecast;
  });
  return values;
};

const cache = new Map<number, { values: YearValues; at: number }>();
const inflight = new Map<number, Promise<YearValues>>();
const TTL_MS = 15 * 60 * 1000;

const getYearValues = async (year: number): Promise<YearValues> => {
  const cached = cache.get(year);
  if (cached && Date.now() - cached.at < TTL_MS) {
    return cached.values;
  }
  const pending = inflight.get(year);
  if (pending) return pending;
  const promise = (async () => {
    let values: YearValues;
    try {
      values = await callMlService(year);
    } catch (error) {
      console.error(
        JSON.stringify({
          service: 'warewise-api',
          event: 'ml_forecast_fallback',
          year,
          error: error instanceof Error ? error.message : String(error),
        }),
      );
      values = buildFallbackYear(year);
    }
    cache.set(year, { values, at: Date.now() });
    inflight.delete(year);
    return values;
  })();
  inflight.set(year, promise);
  return promise;
};

export const predictMonthly: RequestHandler = async (request, response) => {
  try {
    const parsedYear = Number.parseInt(String(request.query.year ?? ''), 10);
    const year =
      Number.isFinite(parsedYear) && parsedYear > 1990 && parsedYear < 2200
        ? parsedYear
        : new Date().getFullYear();
    const parsedMonth = Number.parseInt(String(request.query.month ?? ''), 10);
    const month = Math.min(12, Math.max(1, Number.isFinite(parsedMonth) ? parsedMonth : 1));
    const values = await getYearValues(year);
    response.status(200).json(values[month]);
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
};
