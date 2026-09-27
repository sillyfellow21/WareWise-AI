import 'dotenv/config';
import { app } from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
  console.log(JSON.stringify({ service: 'warewise-api', port: env.port, environment: env.nodeEnv }));
});
