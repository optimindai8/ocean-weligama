import test from 'node:test';
import assert from 'node:assert/strict';
import { ContactMessage } from '../src/domain/contact/ContactMessage.js';
import { ValidationError } from '../src/domain/shared/errors.js';

const valid = {
  name: '  Nimal   Perera ',
  email: ' Nimal@Example.com ',
  phone: '+94 77 123 4567',
  subject: '',
  message: 'Do you have a room free next weekend?',
};

test('ContactMessage cleans input and applies the default subject', () => {
  const message = ContactMessage.create(valid);
  assert.equal(message.name, 'Nimal Perera');
  assert.equal(message.email, 'nimal@example.com');
  assert.equal(message.subject, 'General enquiry');
});

test('ContactMessage reports every invalid field at once', () => {
  assert.throws(
    () => ContactMessage.create({ name: '', email: 'nope', phone: 'abc', message: 'short' }),
    (error) =>
      error instanceof ValidationError &&
      ['name', 'email', 'phone', 'message'].every((field) => field in error.errors),
  );
});
