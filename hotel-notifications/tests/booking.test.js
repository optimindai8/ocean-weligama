import test from 'node:test';
import assert from 'node:assert/strict';
import { Booking } from '../src/domain/booking/Booking.js';
import { ValidationError } from '../src/domain/shared/errors.js';

const rooms = [{ id: 'standard', name: 'Standard Room', pricePerNight: 12000, maxGuests: 2 }];
const context = { rooms, today: '2026-11-09', reference: 'BK-TEST' };

const valid = {
  name: 'Kamala Silva',
  email: 'kamala@example.com',
  phone: '0771234567',
  roomId: 'standard',
  checkIn: '2026-12-01',
  checkOut: '2026-12-04',
  guests: '2',
  notes: '',
};

const errorsFor = (overrides) => {
  try {
    Booking.create({ ...valid, ...overrides }, context);
  } catch (error) {
    assert.ok(error instanceof ValidationError);
    return error.errors;
  }
  return {};
};

test('Booking calculates nights and the full price', () => {
  const booking = Booking.create(valid, context);
  assert.equal(booking.nights, 3);
  assert.equal(booking.totalPrice, 36000);
  assert.equal(booking.room.name, 'Standard Room');
});

test('Booking rejects past check-in, bad ranges and too many guests', () => {
  assert.ok(errorsFor({ checkIn: '2026-11-01', checkOut: '2026-11-03' }).checkIn);
  assert.ok(errorsFor({ checkOut: '2026-12-01' }).checkOut);
  assert.ok(errorsFor({ guests: '3' }).guests);
  assert.ok(errorsFor({ roomId: 'unknown' }).roomId);
});
