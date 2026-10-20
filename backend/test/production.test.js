import bcrypt from "bcrypt";
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { validateEnvironment } from '../src/config/environment.js';

test('production refuses weak secrets and unencrypted database connections', () => {
  const previous = { ...process.env };
  try {
    Object.assign(process.env, { NODE_ENV: 'production', DB_HOST: 'localhost', DB_USER: 'test', DB_NAME: 'test', DB_PASSWORD: 'test', JWT_SECRET: 'short', DB_SSL: 'true' });
    assert.throws(validateEnvironment, /JWT_SECRET/);
    process.env.JWT_SECRET = 'a'.repeat(32);
    process.env.DB_SSL = 'false';
    assert.throws(validateEnvironment, /DB_SSL/);
  } finally { process.env = previous; }
});

test('HTTP health, API fallback, authentication and cross-site protection', async () => {
  const child = spawn(process.execPath, ['app.js'], {
    cwd: new URL('../', import.meta.url),
    env: { ...process.env, NODE_ENV: 'production', PORT: '0', DB_HOST: '127.0.0.1', DB_PORT: '1', DB_USER: 'test', DB_NAME: 'test', DB_PASSWORD: 'test', JWT_SECRET: 'a'.repeat(32), DB_SSL: 'true' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  try {
    const port = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Server startup timeout')), 10000);
      child.once('exit', code => { clearTimeout(timer); reject(new Error(`Server exited: ${code}`)); });
      child.stdout.on('data', data => {
        const match = data.toString().match(/puerto (\d+)/);
        if (match) { clearTimeout(timer); resolve(match[1]); }
      });
    });
    const url = `http://127.0.0.1:${port}`;
    const health = await fetch(url + '/api/health');
    assert.equal(health.status, 200);
    assert.equal(health.headers.get('x-powered-by'), null);
    assert.equal(health.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await health.json(), { status: 'ok' });
    const spa = await fetch(url + '/login');
    assert.equal(spa.status, 200);
    assert.match(await spa.text(), /<div id="root">/);
    assert.equal((await fetch(url + '/assets/missing.js')).status, 404);
    const missing = await fetch(url + '/api/missing');
    assert.equal(missing.status, 404);
    assert.match(missing.headers.get('content-type'), /json/);
    assert.equal((await fetch(url + '/api/users/profile')).status, 401);
    assert.equal((await fetch(url + '/api/auth/login', { method: 'POST', headers: { Origin: 'https://attacker.example' } })).status, 403);
    assert.equal((await fetch(url + '/api/ready')).status, 503);
    let limited;
    for (let i = 0; i < 31; i++) limited = await fetch(url + '/api/auth/missing');
    assert.equal(limited.status, 429);
  } finally {
    const exited = once(child, 'exit');
    child.kill();
    await exited;
  }
});

test("bcrypt hashes and verifies passwords with the production dependency", async () => {
  const hash = await bcrypt.hash("test-password-123", 10);
  assert.equal(await bcrypt.compare("test-password-123", hash), true);
  assert.equal(await bcrypt.compare("wrong-password", hash), false);
});
