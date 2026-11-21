import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    // better-sqlite3 is a native module: isolate each test file in its own process.
    pool: 'forks',
  },
});
