/**
 * Local end-to-end smoke test: boots an embedded Postgres, applies the Prisma
 * schema, starts the typed API (with seed) and exercises every route the
 * deployed React client depends on.
 *
 * Requires the (deliberately untracked) dev-only Postgres binaries:
 *   npm install --no-save embedded-postgres && node scripts/local-smoke.mjs
 */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = 6099;
const pgPort = 55432;
const baseUrl = `http://127.0.0.1:${port}`;
const databaseDir = mkdtempSync(path.join(tmpdir(), 'warewise-smoke-'));

process.env.DATABASE_URL = `postgresql://postgres:password@localhost:${pgPort}/warewise`;
process.env.API_PORT = String(port);
process.env.NODE_ENV = 'development';
process.env.ML_SERVICE_URL = 'http://127.0.0.1:59999'; // no ML locally: fallback path

const log = (stepName, detail = '') => console.log(`ok  ${stepName}${detail ? ` - ${detail}` : ''}`);
const steps = [];
const step = async (name, fn) => {
  try {
    await fn();
    log(name);
    steps.push(name);
  } catch (error) {
    console.error(`FAIL ${name} - ${error instanceof Error ? error.message : error}`);
    process.exitCode = 1;
    throw error;
  }
};

const run = (command, args) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: serverDir, shell: true, stdio: 'inherit' });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${command} exited ${code}`))));
  });

const jsonFetch = async (pathName, init = {}) => {
  const response = await fetch(`${baseUrl}${pathName}`, init);
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  return { response, body };
};

let embedded;
let serverProcess;

const shutdown = async () => {
  try {
    serverProcess?.kill();
  } catch {
    /* already dead */
  }
  try {
    if (embedded) await embedded.stop();
  } catch {
    /* already stopped */
  }
  try {
    rmSync(databaseDir, { recursive: true, force: true });
  } catch {
    /* best effort */
  }
};

process.on('exit', () => {
  void shutdown();
});

try {
  const { default: EmbeddedPostgres } = await import('embedded-postgres');
  embedded = new EmbeddedPostgres({
    databaseDir,
    user: 'postgres',
    password: 'password',
    port: pgPort,
    persistent: false,
    // Windows initdb rejects locale names derived from the OS locale on some
    // systems; C/UTF-8 keeps the cluster deterministic for the Prisma schema.
    initdbFlags: ['--lc-messages=C', '--locale=C', '--encoding=UTF8'],
  });
  await embedded.initialise();
  await embedded.start();
  await embedded.createDatabase('warewise');
  log('embedded postgres ready');

  await run('npx', ['prisma', 'db', 'push', '--skip-generate']);
  log('prisma db push applied');

  serverProcess = spawn('node', ['dist/server.js'], {
    cwd: serverDir,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: process.env,
    shell: true,
  });
  serverProcess.stdout.on('data', (chunk) => process.stdout.write(`[api] ${chunk}`));
  serverProcess.stderr.on('data', (chunk) => process.stderr.write(`[api] ${chunk}`));

  let listening = false;
  for (let attempt = 0; attempt < 60 && !listening; attempt += 1) {
    try {
      const probe = await fetch(`${baseUrl}/health`);
      listening = probe.ok;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  if (!listening) throw new Error('API did not start');

  await step('health', async () => {
    const { response } = await jsonFetch('/health');
    assert.equal(response.status, 200);
  });

  let token;
  let userId;
  await step('login demo supplier', async () => {
    const { response, body } = await jsonFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'johndoe@example.com', password: 'password123' }),
    });
    assert.equal(response.status, 200, JSON.stringify(body));
    assert.ok(body.token, 'token present');
    assert.equal(body.user._id, 'seed_user_johndoe');
    assert.equal(body.user.password, undefined, 'password stripped');
    token = body.token;
    userId = body.user._id;
  });

  let employeeId;
  await step('login demo employee', async () => {
    const { body } = await jsonFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'janesmith@example.com', password: 'password456' }),
    });
    employeeId = body.user._id;
    assert.equal(employeeId, 'seed_user_janesmith');
  });

  await step('feed returns seeded products', async () => {
    const { response, body } = await jsonFetch(
      '/products?page=1&sort=quantity,desc&category=&status=&name=',
    );
    assert.equal(response.status, 200);
    assert.equal(body.total, 7, 'seeded product count');
    assert.ok(Array.isArray(body.category) && body.category.length >= 6);
    assert.ok(body.status.includes('Marketplace'));
    const first = body.products[0];
    assert.ok(first._id && typeof first.bookings === 'object');
  });

  await step('owner feed filters by userId', async () => {
    const { body } = await jsonFetch(`/products/${employeeId}/products?page=1&sort=quantity,desc`);
    assert.equal(body.total, 1, 'janesmith owns the Wireless Mouse');
    assert.equal(body.products[0].name, 'Wireless Mouse');
  });

  await step('product detail', async () => {
    const { response, body } = await jsonFetch('/products/seed_product_running_shoes/product');
    assert.equal(response.status, 200);
    assert.equal(body.name, 'Running Shoes');
    assert.equal(body.userId, 'seed_user_johndoe');
  });

  await step('get user with token', async () => {
    const { response, body } = await jsonFetch(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(response.status, 200);
    assert.equal(body.firstName, 'John');
    assert.equal(body.securityAnswer, undefined, 'security answer stripped');
  });

  await step('patch user profile', async () => {
    const { response, body } = await jsonFetch(`/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ _id: userId, firstName: 'John', phoneNumber: '0001112222' }),
    });
    assert.equal(response.status, 200);
    assert.equal(body.user.phoneNumber, '0001112222');
  });

  await step('booking toggle + booked feed', async () => {
    const { response, body } = await jsonFetch('/products/seed_product_running_shoes/booking', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId: employeeId }),
    });
    assert.equal(response.status, 200);
    assert.equal(body.bookings[employeeId], true);

    const booked = await jsonFetch(`/products/${employeeId}/bookedproducts?page=1`);
    assert.equal(booked.body.total, 1);
    assert.equal(booked.body.products[0]._id, 'seed_product_running_shoes');
  });

  await step('create product (multipart) returns full list', async () => {
    const form = new FormData();
    form.append('userId', userId);
    form.append('name', 'Smoke Test Widget');
    form.append('description', 'created by local smoke test');
    form.append('price', '9.99');
    form.append('quantity', '5');
    form.append('category', 'Electronics');
    form.append('status', 'Marketplace');
    const { response, body } = await jsonFetch('/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    assert.equal(response.status, 201, JSON.stringify(body));
    assert.equal(body.length, 8, 'legacy shape: full product array');
    assert.ok(body.some((product) => product.name === 'Smoke Test Widget'));
  });

  await step('delete product (owner checked)', async () => {
    const created = await jsonFetch('/products?page=1&name=Smoke%20Test%20Widget');
    const productId = created.body.products[0]._id;
    const { response, body } = await jsonFetch(`/products/${userId}/${productId}/delete`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(response.status, 200);
    assert.equal(body.message, 'Product deleted successfully');
    const after = await jsonFetch('/products?page=1&name=Smoke%20Test%20Widget');
    assert.equal(after.body.total, 0);
  });

  await step('register + login new account', async () => {
    const form = new FormData();
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64',
    );
    form.append('picture', new Blob([png], { type: 'image/png' }), 'avatar.png');
    form.append('picturePath', 'avatar.png');
    form.append('firstName', 'Smoke');
    form.append('lastName', 'Tester');
    form.append('email', 'smoketester@example.com');
    form.append('password', 'smoke123');
    form.append('role', 'employee');
    form.append('location', 'Test City');
    form.append('phoneNumber', '5551234567');
    form.append('securityQuestion', 'Favorite color?');
    form.append('securityAnswer', 'teal');
    const { response, body } = await jsonFetch('/auth/register', { method: 'POST', body: form });
    assert.equal(response.status, 201, JSON.stringify(body));

    const login = await jsonFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'smoketester@example.com', password: 'smoke123' }),
    });
    assert.equal(login.response.status, 200);
  });

  await step('uploaded avatar served from /assets', async () => {
    const response = await fetch(`${baseUrl}/assets/avatar.png`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /image\/png/);
  });

  await step('seed avatar served as svg fallback', async () => {
    const response = await fetch(`${baseUrl}/assets/path/to/picture1.jpg`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /image\/svg\+xml/);
  });

  await step('forgot-password flow', async () => {
    const verify = await jsonFetch('/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'smoketester@example.com' }),
    });
    assert.equal(verify.body.securityQuestion, 'Favorite color?');

    const wrong = await jsonFetch('/auth/reset-password-security', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'smoketester@example.com',
        securityAnswer: 'nope',
        password: 'x',
      }),
    });
    assert.equal(wrong.response.status, 400);

    const right = await jsonFetch('/auth/reset-password-security', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'smoketester@example.com',
        securityAnswer: 'teal',
        password: 'newpass123',
      }),
    });
    assert.equal(right.body.success, true);

    const login = await jsonFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'smoketester@example.com', password: 'newpass123' }),
    });
    assert.equal(login.response.status, 200);
  });

  await step('predictMonthly fallback (no ML running)', async () => {
    const { response, body } = await jsonFetch('/predictMonthly?month=1&year=2026');
    assert.equal(response.status, 200);
    for (const key of ['P1', 'P2', 'P3', 'P4']) {
      assert.ok(Number.isFinite(body[key]) && body[key] > 0, `${key} numeric`);
    }
    const cached = await jsonFetch('/predictMonthly?month=2&year=2026');
    assert.ok(Number.isFinite(cached.body.P4));
  });

  console.log(`\nAll ${steps.length} smoke steps passed.`);
} catch (error) {
  process.exitCode = 1;
  console.error('Smoke test aborted:', error);
} finally {
  await shutdown();
}
