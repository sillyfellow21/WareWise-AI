import 'dotenv/config';
import { app } from './app.js';
import { env } from './config/env.js';

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
