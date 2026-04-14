import { pbkdf2Sync, randomBytes } from 'node:crypto';

const password = process.argv[2];

if (!password) {
  // eslint-disable-next-line no-console
  console.error('Usage: node scripts/generate-admin-password-hash.mjs "<password>"');
  process.exit(1);
}

const ITERATIONS = 100000;
const KEY_LENGTH = 32;
const DIGEST = 'sha256';
const salt = randomBytes(16);
const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);

// eslint-disable-next-line no-console
console.log(`pbkdf2_sha256$${ITERATIONS}$${salt.toString('base64')}$${hash.toString('base64')}`);
