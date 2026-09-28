import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';

process.env.API_PORT = '0';
const { app } = await import('../dist/app.js');

const server = http.createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}`;

test.after(() => server.close());

test('health is live and returns a request id', async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { data: { status: 'ok' } });
  assert.match(response.headers.get('x-request-id'), /^req_/);
});

test('platform health check target answers 200', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { data: { status: 'ok' } });
});

test('readiness reports missing dependencies instead of claiming ready', async () => {
  const response = await fetch(`${baseUrl}/ready`);
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.deepEqual(body.data.checks, { database: false, redis: false });
});

test('metrics is plain text', async () => {
  const response = await fetch(`${baseUrl}/metrics`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /warewise_process_uptime_seconds/);
});