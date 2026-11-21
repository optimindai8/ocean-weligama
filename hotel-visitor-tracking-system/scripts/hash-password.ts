/**
 * Creates the value for ADMIN_PASSWORD_HASH.
 *   npm run hash-password
 * The password is typed at a hidden prompt, so it never ends up in your shell history.
 */
import { hashPassword } from '../src/infrastructure/security/ScryptPassword.js';

function readHidden(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const { stdin, stdout } = process;
    stdout.write(prompt);

    if (!stdin.isTTY) {
      // Piped input (e.g. from a secrets manager): read one line.
      let data = '';
      stdin.setEncoding('utf8');
      stdin.on('data', (chunk) => (data += chunk));
      stdin.on('end', () => resolve(data.split(/\r?\n/)[0] ?? ''));
      stdin.on('error', reject);
      return;
    }

    let value = '';
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    const onData = (char: string): void => {
      for (const c of char) {
        if (c === '\r' || c === '\n' || c === '\u0004') {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.off('data', onData);
          stdout.write('\n');
          resolve(value);
          return;
        }
        if (c === '\u0003') process.exit(130); // Ctrl+C
        if (c === '\u007f' || c === '\b') value = value.slice(0, -1);
        else value += c;
      }
    };
    stdin.on('data', onData);
  });
}

const password = await readHidden('New admin password (min 12 characters): ');
if (password.length < 12) {
  console.error('Password is too short. Use at least 12 characters.');
  process.exit(1);
}
if (process.stdin.isTTY) {
  const again = await readHidden('Repeat password: ');
  if (again !== password) {
    console.error('Passwords do not match.');
    process.exit(1);
  }
}

console.log('\nPut this line in your .env file:\n');
console.log(`ADMIN_PASSWORD_HASH=${await hashPassword(password)}`);
