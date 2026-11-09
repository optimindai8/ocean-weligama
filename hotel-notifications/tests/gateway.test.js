import test from 'node:test';
import assert from 'node:assert/strict';
import { EmailJsNotificationGateway } from '../src/infrastructure/emailjs/EmailJsNotificationGateway.js';
import { createFormatters } from '../src/infrastructure/emailjs/formatters.js';

const dummyConfig = {
  publicKey: 'test_public_key',
  serviceId: 'test_service_id',
  templates: {
    contact: 'template_contact_test',
    booking: 'template_booking_test',
  },
};

const formatter = createFormatters({
  locale: 'en-GB',
  timeZone: 'Asia/Colombo',
  currency: 'EUR',
});

test('EmailJsNotificationGateway sends contact email payload via fetch', async () => {
  let capturedUrl = '';
  let capturedBody = null;

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    capturedUrl = url;
    capturedBody = JSON.parse(options.body);
    return {
      ok: true,
      status: 200,
      text: async () => 'OK',
    };
  };

  try {
    const gateway = new EmailJsNotificationGateway({
      config: dummyConfig,
      formatter,
      hotelName: 'Ocean Air Weligama',
      sdk: null, // Test fetch path
    });

    const result = await gateway.sendContactNotification(
      {
        subject: 'General Question',
        name: 'Sunil Perera',
        email: 'sunil@example.com',
        phone: '+94 77 000 0000',
        message: 'Hello from Weligama!',
      },
      new Date('2026-11-09T10:00:00Z')
    );

    assert.equal(result.status, 200);
    assert.equal(capturedUrl, 'https://api.emailjs.com/api/v1.0/email/send');
    assert.equal(capturedBody.service_id, 'test_service_id');
    assert.equal(capturedBody.template_id, 'template_contact_test');
    assert.equal(capturedBody.user_id, 'test_public_key');
    assert.equal(capturedBody.template_params.hotel_name, 'Ocean Air Weligama');
    assert.equal(capturedBody.template_params.name, 'Sunil Perera');
    assert.equal(capturedBody.template_params.email, 'sunil@example.com');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('EmailJsNotificationGateway sends booking email payload via fetch with accurate fields', async () => {
  let capturedBody = null;

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    capturedBody = JSON.parse(options.body);
    return {
      ok: true,
      status: 200,
      text: async () => 'OK',
    };
  };

  try {
    const gateway = new EmailJsNotificationGateway({
      config: dummyConfig,
      formatter,
      hotelName: 'Ocean Air Weligama',
      sdk: null,
    });

    const result = await gateway.sendBookingNotification(
      {
        reference: 'OW-20261109-TEST',
        guestFullName: 'Elena Rostova',
        guestEmail: 'elena@example.com',
        guestPhone: '+33 6 12 34 56 78',
        roomName: 'Ocean Deluxe Villa',
        checkIn: '2026-12-10',
        checkOut: '2026-12-17',
        nights: 7,
        guestCount: 2,
        totalPrice: '€1,750.00',
        pricePerNight: '€250.00',
        specialRequests: 'Late arrival at 9 PM. Airport pickup requested.',
      },
      new Date('2026-11-09T10:00:00Z')
    );

    assert.equal(result.status, 200);
    assert.equal(capturedBody.template_id, 'template_booking_test');
    assert.equal(capturedBody.template_params.hotel_name, 'Ocean Air Weligama');
    assert.equal(capturedBody.template_params.booking_ref, 'OW-20261109-TEST');
    assert.equal(capturedBody.template_params.guest_name, 'Elena Rostova');
    assert.equal(capturedBody.template_params.email, 'elena@example.com');
    assert.equal(capturedBody.template_params.phone, '+33 6 12 34 56 78');
    assert.equal(capturedBody.template_params.room_name, 'Ocean Deluxe Villa');
    assert.equal(capturedBody.template_params.nights, '7');
    assert.equal(capturedBody.template_params.guests, '2');
    assert.equal(capturedBody.template_params.total_price, '€1,750.00');
    assert.equal(capturedBody.template_params.price_per_night, '€250.00');
    assert.equal(capturedBody.template_params.notes, 'Late arrival at 9 PM. Airport pickup requested.');
    assert.equal(capturedBody.template_params.reply_to, 'elena@example.com');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

