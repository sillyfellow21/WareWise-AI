const requiredInProduction = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

const defaultMlServiceUrl = 'http://localhost:8000';

/**
 * Render injects sibling service addresses without a scheme.
 * Private-network hosts are undotted (warewise-ml:10000), public hosts carry a
 * domain (warewise-ml.onrender.com), so the scheme can be inferred safely.
 */
const withScheme = (value: string): string => {
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) {
    return value;
  }
  return value.includes('.') ? `https://${value}` : `http://${value}`;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  // Render injects PORT. API_PORT keeps local development working. The empty-string
  // guards keep a blank PORT entry in a local .env from binding a random port.
  port: Number(process.env.PORT || process.env.API_PORT || 6001),
  host: process.env.HOST ?? '0.0.0.0',
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  mlServiceUrl: withScheme(process.env.ML_SERVICE_URL ?? defaultMlServiceUrl),
};

if (env.nodeEnv === 'production') {
  const missing = requiredInProduction.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing production environment variables: ${missing.join(', ')}`);
  }
}
