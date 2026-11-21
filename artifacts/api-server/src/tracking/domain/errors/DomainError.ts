/** Base class for all errors that represent a broken business rule. */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** Input does not satisfy a domain invariant (maps to HTTP 400). */
export class ValidationError extends DomainError {}

/** Caller could not prove who they are (maps to HTTP 401). */
export class AuthenticationError extends DomainError {}
