const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:6001";
const PREDICTION_URL = import.meta.env.VITE_PREDICTION_URL || "http://localhost:5000";

export const buildApiUrl = (path) => {
  const normalizedBase = API_BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export const buildPredictionUrl = (path) => {
  const normalizedBase = PREDICTION_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export { API_BASE_URL, PREDICTION_URL };
