const requiredInProduction = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.API_PORT ?? 6001),
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  mlServiceUrl: process.env.ML_SERVICE_URL ?? 'http://localhost:8000',
};

if (env.nodeEnv === 'production') {
  const missing = requiredInProduction.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing production environment variables: ${missing.join(', ')}`);
  }
}
