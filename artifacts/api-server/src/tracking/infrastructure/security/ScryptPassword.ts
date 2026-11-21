import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

/**
 * Password hashing with scrypt (memory-hard, built into Node.js: no extra dependency).
 * Stored format: scrypt$N$r$p$salt(base64)$hash(base64)
 */
const COST = 32_768; // N
const BLOCK_SIZE = 8; // r
const PARALLELISM = 1; // p
const KEY_LENGTH = 64;
const MAX_COST = 1 << 20;

function derive(password: string, salt: Buffer, n: number, r: number, p: number, keyLength: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLength, { N: n, r, p, maxmem: 256 * n * r }, (error, key) =>
      error ? reject(error) : resolve(key),
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, COST, BLOCK_SIZE, PARALLELISM, KEY_LENGTH);
  return ['scrypt', COST, BLOCK_SIZE, PARALLELISM, salt.toString('base64'), key.toString('base64')].join('$');
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

  const n = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  const salt = Buffer.from(parts[4] ?? '', 'base64');
  const expected = Buffer.from(parts[5] ?? '', 'base64');

  const validCost = Number.isInteger(n) && n > 1 && n <= MAX_COST && (n & (n - 1)) === 0;
  if (!validCost || !Number.isInteger(r) || r < 1 || r > 32 || !Number.isInteger(p) || p < 1 || p > 16) return false;
  if (salt.length < 8 || expected.length < 16) return false;

  const actual = await derive(password, salt, n, r, p, expected.length);
  return timingSafeEqual(actual, expected);
}
