# Setup Guide: Hotel Email Notifications (EmailJS + Gmail)

Follow the steps in order. Total time: about 15 minutes.

## 0. What you get

| Event | Email goes to | Contains |
|---|---|---|
| Contact form submitted | Hotel inbox | Customer name, email, phone, subject, message, time |
| Booking requested | Hotel inbox | Guest name, email, phone, room, dates, nights, guests, **total price**, special requests, booking reference |

## 1. Free plan facts (checked on emailjs.com/pricing, 9 Nov 2026)

- **200 requests per month** in total. One form submission = one request, so contact and booking share the 200.
- **2 email templates**. This project uses exactly 2 (contact + booking), so there is no room for a third without upgrading.
- 50 KB per request (this project sends far less).
- Email history is kept for 7 days.
- No domain allowlist on the free plan, and free emails carry a small "Email sent via EmailJS.com" footer.

## 2. Folder structure

```
hotel-notifications/
├── contact.html                 Contact page (demo / copy into your site)
├── booking.html                 Booking page (demo / copy into your site)
├── assets/css/styles.css        Styles for the two pages
├── email-templates/             Paste these into EmailJS (Steps 4 and 5)
│   ├── contact-notification.html
│   └── booking-notification.html
├── src/
│   ├── config/                  Keys, hotel name, room rates  <- you edit these
│   ├── domain/                  Business rules: validation, pricing (no browser, no EmailJS)
│   ├── application/             Use cases + the NotificationGateway port
│   ├── infrastructure/          EmailJS adapter, formatters, booking reference
│   ├── presentation/            Page controllers and DOM helpers
│   └── composition.js           Wires everything together (only place that does)
├── tests/                       Automated tests (npm test)
└── docs/SETUP.md                This guide
```

Dependency direction: `presentation -> application -> domain`, and `infrastructure -> application`. The domain never imports EmailJS, so switching email provider later only touches `infrastructure/`.

## 3. EmailJS Step 1: Gmail service

1. Log in at https://dashboard.emailjs.com and open **Email Services**.
2. Open your service `service_ejpik4l`. Confirm it is connected to the Gmail account you want emails sent **from** (ideally the hotel's own Gmail or Google Workspace address).
3. If you ever reconnect it, the Google consent screen has a permission to **send email on your behalf**. Tick it. If it is unticked, sending fails (usually HTTP 412 / "insufficient authentication scopes").
4. Use the service's **Send Test Email** button once to confirm the connection works.

## 4. EmailJS Step 2: Contact template (`template_vo2foc9`)

1. Go to **Email Templates** and open `template_vo2foc9`.
2. **Content tab**: open the editor, switch to the **code / HTML view**, delete everything, and paste the whole of `email-templates/contact-notification.html`.
3. **Settings tab**: set each field exactly like this.

| Field | Value |
|---|---|
| Template name | Contact notification |
| **Subject** | `Website Contact: {{title}} - {{name}}` |
| **To Email** | The hotel inbox that should receive alerts (typed in, not a variable) |
| **From Name** | `{{hotel_name}} Website` |
| **From Email** | Tick **Use Default Email Address** (your connected Gmail) |
| **Reply To** | `{{reply_to}}` |
| Bcc / Cc | Leave empty (or add a manager's address) |

Your old subject was `Contact Us: {{title}}`. The new one adds the customer's name so staff can see who wrote before opening the email.

4. Click **Save**, then **Test It** and fill the variables: `hotel_name`, `title`, `name`, `email`, `phone`, `message`, `time`, `reply_to`. Check that the test email arrives.

## 5. EmailJS Step 3: Booking template (new)

1. In **Email Templates** click **Create New Template**.
2. In the template settings, set the **Template ID** to `template_booking` (or keep the generated one and copy it).
3. **Content tab**: open the code / HTML view and paste `email-templates/booking-notification.html`.
4. **Settings tab**:

| Field | Value |
|---|---|
| Template name | Booking notification |
| **Subject** | `New Booking {{booking_ref}} - {{guest_name}} - {{total_price}}` |
| **To Email** | The hotel inbox (same address as Step 4, or a dedicated reservations inbox) |
| **From Name** | `{{hotel_name}} Website` |
| **From Email** | Tick **Use Default Email Address** |
| **Reply To** | `{{reply_to}}` |

5. Save, then **Test It** with: `hotel_name`, `booking_ref`, `guest_name`, `email`, `phone`, `room_name`, `check_in`, `check_out`, `nights`, `guests`, `price_per_night`, `total_price`, `notes`, `time`, `reply_to`.

## 6. Configure the project

1. `src/config/emailjs.config.js`: your public key, service ID and contact template ID are already filled in. Replace `YOUR_BOOKING_TEMPLATE_ID` with `template_booking` (or the ID you copied).
2. `src/config/hotel.config.js`: set the hotel **name**, and replace the **sample room names and prices** with your real rates and maximum guests.

The `emailjs.init(...)` call from your CDN snippet is done once, inside `src/infrastructure/emailjs/EmailJsNotificationGateway.js`, using the key from the config file. That keeps the key in one place. Both HTML pages already include the CDN script tag you provided.

## 7. Run it locally

The pages use ES modules, which browsers block when opened by double-clicking (`file://`). Serve the folder instead:

```bash
npm start                       # then open http://localhost:8080/contact.html
# or, without npm:
python3 -m http.server 8080
```

Submit both forms and confirm two emails arrive in the hotel inbox. Run `npm test` to execute the automated tests.

## 8. Keep emails out of spam

Emails are sent through your connected Gmail account, so they carry Google's own SPF and DKIM signatures. That is the strongest deliverability setup available on this plan. Then:

1. **Send to a mailbox you control.** Best case: the To address is the same Gmail account that is connected in EmailJS, or an address on your Google Workspace domain.
2. **Create a Gmail filter** in the receiving inbox: Settings > See all settings > Filters and Blocked Addresses > Create a new filter. In **From**, enter the connected Gmail address, then **Create filter** and tick **Never send it to Spam**, **Star it** and **Apply the label** "Website Leads".
3. If the very first test lands in Spam, open it and click **Report not spam**.
4. The templates already follow good practice: real subject lines, no images, no URL shorteners, no ALL-CAPS or exclamation marks, and plain readable content.

## 9. Go live

- **Using these pages as they are**: upload the whole folder to your hosting over HTTPS.
- **Adding to an existing hotel site**: copy `src/` and `assets/css/styles.css`, then copy the `<form>`, the CDN `<script>` tag and the module `<script>` block from `contact.html` and `booking.html`. Keep the element IDs and field names unchanged, because the page controllers rely on them. You can restyle freely.

## 10. Protect your 200 monthly emails

Already built in: honeypot field, 30-second cooldown between submissions, strict input validation and length limits. Template variables are HTML-escaped by EmailJS, so customer text cannot inject markup into your email.

Recommended extras:

- **reCAPTCHA v2** is free and supported by EmailJS (Template **Settings** tab: enable reCAPTCHA V2 verification and add your secret key). It also needs the reCAPTCHA widget added to the forms. It is not wired in by default; it is a small addition if you want it.
- Watch usage in the EmailJS dashboard during the first weeks.
- Booking totals are calculated in the browser from your room rates. Treat each email as a **booking request** and confirm availability and price with the guest.

## 11. Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| Blank page, console says `emailjs` is undefined | The CDN `<script>` tag is missing or blocked. It must come before the module script. |
| Console error about modules / CORS | You opened the file directly. Use `npm start` or any web server. |
| "template ... is not configured" | `YOUR_BOOKING_TEMPLATE_ID` is still in `emailjs.config.js`. |
| EmailJS error 400 | Wrong service or template ID, or a template variable name was changed. |
| EmailJS error 412 | Gmail permission missing. Reconnect Gmail and tick the send-email permission (Step 3). |
| EmailJS error 429 | Rate limit or the 200 monthly requests are used up. |
| Email arrives with empty fields | A variable in the template does not match the names in section 12. |
| Email lands in Spam | Apply Step 8, then report the first one as not spam. |

## 12. Template variable reference

**Contact template**: `hotel_name`, `title`, `name`, `email`, `phone`, `message`, `time`, `reply_to`

**Booking template**: `hotel_name`, `booking_ref`, `guest_name`, `email`, `phone`, `room_name`, `check_in`, `check_out`, `nights`, `guests`, `price_per_night`, `total_price`, `notes`, `time`, `reply_to`

These names are defined in one file: `src/infrastructure/emailjs/templateParams.js`.
