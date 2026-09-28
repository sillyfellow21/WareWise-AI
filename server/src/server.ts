import 'dotenv/config';
import { app } from './app.js';
import { env } from './config/env.js';
import { seedDatabase } from './db/seed.js';

// Idempotent demo-data seed (seven accounts + marketplace listings) runs before
// the first request can hit the API; failures are logged, never fatal.
await seedDatabase();

app.listen(env.port, env.host, () => {
  console.log(
    JSON.stringify({
      service: 'warewise-api',
      host: env.host,
      port: env.port,
      environment: env.nodeEnv,
    }),
  );
});
