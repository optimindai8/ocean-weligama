import test from 'node:test';
import assert from 'node:assert/strict';
import { GetBookingQuote } from '../src/application/GetBookingQuote.js';
import { SendBookingNotification } from '../src/application/SendBookingNotification.js';
import { SendContactNotification } from '../src/application/SendContactNotification.js';
import { ValidationError } from '../src/domain/shared/errors.js';

const rooms = [{ id: 'standard', name: 'Standard Room', pricePerNight: 12000, maxGuests: 2 }];
const now = new Date('2026-11-09T04:00:00Z'); // 09:30 in Colombo

function fakeGateway() {
  const sent = [];
  return {
    sent,
    async sendContactNotification(message, sentAt) {
      sent.push({ type: 'contact', message, sentAt });
    },
    async sendBookingNotification(booking, sentAt) {
      sent.push({ type: 'booking', booking, sentAt });
    },
  };
}

test('contact use case sends one notification for valid input', async () => {
  const gateway = fakeGateway();
  const useCase = new SendContactNotification({ notificationGateway: gateway, clock: () => now });
  await useCase.execute({
    name: 'Nimal Perera',
    email: 'nimal@example.com',
    phone: '0771234567',
    message: 'Do you have a room free next weekend?',
  });
  assert.equal(gateway.sent.length, 1);
  assert.equal(gateway.sent[0].message.subject, 'General enquiry');
});

test('contact use case sends nothing when validation fails', async () => {
  const gateway = fakeGateway();
  const useCase = new SendContactNotification({ notificationGateway: gateway });
  await assert.rejects(() => useCase.execute({}), ValidationError);
  assert.equal(gateway.sent.length, 0);
});

test('booking use case prices the stay and returns the reference', async () => {
  const gateway = fakeGateway();
  const useCase = new SendBookingNotification({
    notificationGateway: gateway,
    rooms,
    timeZone: 'Asia/Colombo',
    referenceGenerator: () => 'BK-TEST',
    clock: () => now,
  });
  const result = await useCase.execute({
    name: 'Kamala Silva',
    email: 'kamala@example.com',
    phone: '0771234567',
    roomId: 'standard',
    checkIn: '2026-12-01',
    checkOut: '2026-12-03',
    guests: '2',
  });
  assert.deepEqual(result, { reference: 'BK-TEST', totalPrice: 24000 });
  assert.equal(gateway.sent.length, 1);
});

test('quote is null until the room and dates are valid', () => {
  const quote = new GetBookingQuote({ rooms });
  assert.equal(quote.execute({ roomId: '', checkIn: '', checkOut: '' }), null);
  assert.equal(quote.execute({ roomId: 'standard', checkIn: '2026-12-03', checkOut: '2026-12-01' }), null);
  assert.equal(quote.execute({ roomId: 'standard', checkIn: '2026-12-01', checkOut: '2026-12-02' }).totalPrice, 12000);
});
