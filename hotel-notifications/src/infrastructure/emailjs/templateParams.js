/**
 * Maps domain objects to the variables used inside the EmailJS templates.
 * Every key below is available as {{key}} in the matching template.
 */

export function toContactTemplateParams(message, sentAt, format, hotelName) {
  return {
    hotel_name: hotelName,
    title: message.subject || 'Website Inquiry',
    name: message.name || message.fullName || '',
    email: message.email || '',
    phone: message.phone || 'Not provided',
    message: message.message || '',
    time: format.dateTime(sentAt),
    reply_to: message.email || '',
  };
}

export function toBookingTemplateParams(booking, sentAt, format, hotelName) {
  const roomName = booking.room?.name || booking.roomName || 'Accommodation';
  
  const pricePerNight = typeof booking.pricePerNight === 'number'
    ? format.money(booking.pricePerNight)
    : String(booking.pricePerNight || 'N/A');

  const totalPrice = typeof booking.totalPrice === 'number'
    ? format.money(booking.totalPrice)
    : String(booking.totalPrice || 'N/A');

  const formatCheckDate = (d) => {
    if (!d) return '';
    if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
      return format.calendarDate(d);
    }
    return String(d);
  };

  return {
    hotel_name: hotelName,
    booking_ref: booking.reference || 'N/A',
    guest_name: booking.name || booking.guestName || booking.guestFullName || '',
    email: booking.email || booking.guestEmail || '',
    phone: booking.phone || booking.guestPhone || 'Not provided',
    room_name: roomName,
    check_in: formatCheckDate(booking.checkIn),
    check_out: formatCheckDate(booking.checkOut),
    nights: String(booking.nights ?? '0'),
    guests: String(booking.guests ?? booking.guestCount ?? '1'),
    price_per_night: pricePerNight,
    total_price: totalPrice,
    notes: booking.notes || booking.specialRequests || 'None',
    time: format.dateTime(sentAt),
    reply_to: booking.email || booking.guestEmail || '',
  };
}
