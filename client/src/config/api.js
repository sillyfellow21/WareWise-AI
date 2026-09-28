const DEFAULT_API_BASE_URL = 'http://localhost:6001';

/**
 * Render exposes sibling service addresses with the scheme omitted: private-network
 * addresses are undotted (`warewise-ml:10000`) while public addresses carry a domain
 * (`warewise-api.onrender.com`), so the scheme can be inferred safely.
 */
function withScheme(value) {
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) {
    return value;
  }
  return value.includes('.') ? `https://${value}` : `http://${value}`;
}

/**
 * The API origin for browser requests. Render injects `VITE_API_BASE_URL` at build
 * time (see render.yaml); unset means local development against the typed API.
 */
export const apiBaseUrl = (() => {
  const configured = import.meta.env?.VITE_API_BASE_URL;
  return configured ? withScheme(configured).replace(/\/+$/, '') : DEFAULT_API_BASE_URL;
})();

/** Builds an absolute API URL from a path such as `/api/v1/health`. */
export function apiUrl(path) {
  return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
