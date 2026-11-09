# Hotel Email Notifications

Sends the hotel an email whenever a customer submits the **contact form** or a **booking request**, using EmailJS (free plan) through a connected Gmail account.

- Contact email: customer name, email, phone, subject, message
- Booking email: guest name, contact details, room, dates, nights, guests, **total price**, booking reference

## Quick start

1. Follow **[docs/SETUP.md](docs/SETUP.md)** (EmailJS dashboard steps, templates, spam prevention).
2. Edit `src/config/emailjs.config.js` (booking template ID) and `src/config/hotel.config.js` (hotel name, room rates).
3. `npm start`, open http://localhost:8080/contact.html and http://localhost:8080/booking.html.
4. `npm test` runs the automated tests.

## Architecture

```
presentation  ->  application  ->  domain
                       ^
               infrastructure (EmailJS adapter)
```

`src/composition.js` is the only file that wires the layers together.
