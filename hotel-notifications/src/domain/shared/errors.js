/** Thrown when user input breaks a business rule. `errors` maps field name to message. */
export class ValidationError extends Error {
  constructor(errors) {
    super('Validation failed');
    this.name = 'ValidationError';
    this.errors = errors;
  }
}
