import { ValidationError } from '../errors/DomainError.js';

const MAX_LENGTH = 200;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

/**
 * Path of a page on the hotel website, e.g. "/rooms/deluxe".
 * Query string and hash are removed on purpose: they can contain personal data
 * (emails, booking references) and would also split one page into many rows.
 */
export class PagePath {
  private constructor(readonly value: string) {}

  static from(raw: unknown): PagePath {
    if (typeof raw !== 'string') throw new ValidationError('path must be a string');

    let path = raw.trim();
    const cut = path.search(/[?#]/);
    if (cut >= 0) path = path.slice(0, cut);

    if (!path.startsWith('/')) throw new ValidationError('path must start with "/"');
    if (CONTROL_CHARS.test(path)) throw new ValidationError('path contains invalid characters');

    // "/rooms/" and "/rooms" are the same page.
    if (path.length > 1) path = path.replace(/\/+$/, '') || '/';

    if (path.length > MAX_LENGTH) throw new ValidationError('path is too long');
    return new PagePath(path);
  }
}
