import assert from 'node:assert/strict';
import test from 'node:test';

import { requireRole, requireSelf } from '../middleware/auth.js';

function responseDouble() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test('requireRole allows an authorized role', () => {
  const response = responseDouble();
  let called = false;

  requireRole('supplier')({ user: { role: 'supplier' } }, response, () => {
    called = true;
  });

  assert.equal(called, true);
  assert.equal(response.statusCode, 200);
});

test('requireRole rejects an unauthorized role', () => {
  const response = responseDouble();
  let called = false;

  requireRole('admin')({ user: { role: 'employee' } }, response, () => {
    called = true;
  });

  assert.equal(called, false);
  assert.equal(response.statusCode, 403);
});

test('requireSelf allows the authenticated user resource', () => {
  const response = responseDouble();
  let called = false;

  requireSelf('userId')(
    { user: { id: 'user-1', role: 'employee' }, params: { userId: 'user-1' } },
    response,
    () => {
      called = true;
    },
  );

  assert.equal(called, true);
});

test('requireSelf rejects another user resource', () => {
  const response = responseDouble();
  let called = false;

  requireSelf('userId')(
    { user: { id: 'user-1', role: 'employee' }, params: { userId: 'user-2' } },
    response,
    () => {
      called = true;
    },
  );

  assert.equal(called, false);
  assert.equal(response.statusCode, 403);
});
