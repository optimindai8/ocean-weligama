# Hotel Visitor Tracking System

Lightweight, privacy-conscious visitor analytics for a hotel website, with a private admin dashboard.
It shows how many guests visit, which pages they open, where they come from, which device and country,
and how many click **Book now**, **Call** or **WhatsApp**.

- **Tracker script**: ~4 KB, one first-party cookie, no timers, no third-party requests.
- **Backend**: Node.js + TypeScript + Express + SQLite (a single file, nothing else to install or run).
- **Dashboard**: plain HTML/CSS/JS, no framework, works on phone and desktop, light and dark.
- **Architecture**: Clean Architecture (domain / application / infrastructure / interfaces).

---

## 1. Quick start

Requires **Node.js 22 or newer** (the current LTS). No compiler or build tools are needed.

```bash
npm install
cp .env.example .env          # then edit .env (see section 2)
npm run hash-password         # prints ADMIN_PASSWORD_HASH=... -> paste into .env
npm run build
npm start                     # http://127.0.0.1:4000
```

Open `http://127.0.0.1:4000/admin/` and sign in.

Development mode with auto-reload: `npm run dev`. Tests: `npm test`. Type check: `npm run typecheck`.

## 2. Configuration (`.env`)

| Variable | Meaning |
|---|---|
| `ALLOWED_ORIGINS` | Exact address of the hotel website, e.g. `https://www.yourhotel.com`. **Only this site can send data.** |
| `APP_SECRET` | 32+ random characters. Signs admin sessions and hashes IP addresses. Generate: `node -p "require('node:crypto').randomBytes(48).toString('base64url')"` |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` | Admin login. Create the hash with `npm run hash-password` (never store the plain password). |
| `TRUST_PROXY` | `1` when behind nginx/Cloudflare, `0` when exposed directly. |
| `REPORT_UTC_OFFSET_MINUTES` | Hotel time zone. Sri Lanka = `330`. "Today" and the daily chart follow this. |
| `COUNTRY_HEADER` | CDN header holding the visitor country. Cloudflare = `cf-ipcountry`. Empty = no country data. |
| `RETENTION_DAYS` | Raw events older than this are deleted automatically (default 395). |
| `DATABASE_PATH` | SQLite file location. Back this file up (see section 6). |

The app refuses to start with a clear message if anything is missing or weak.

## 3. Add the tracker to the hotel website

Put this once before `</body>` on every page (or in the shared footer/layout):

```html
<script defer src="https://analytics.yourhotel.com/hotel-tracker.js"></script>
```

That is all. It will:

- create one cookie `_hv` (random anonymous ID, 180 days, `SameSite=Lax`, `Secure` on https),
- count a page view when a page opens (also on route changes in single-page apps),
- measure **visible** time on the page (paused when the tab is hidden),
- automatically record taps on `tel:`, `mailto:` and WhatsApp links.

Track any button or link by adding an attribute:

```html
<a href="/booking" data-track="booking_click">Book now</a>
<button data-track="contact_submit">Send enquiry</button>
```

Or from code: `hotelTracker.track('booking_click')`. Names are `snake_case`, 2-40 characters.

Optional settings on the script tag:

| Attribute | Effect |
|---|---|
| `data-require-consent="true"` | Do nothing until `hotelTracker.consent(true)` is called (connect it to your cookie banner). |
| `data-respect-dnt="false"` | Ignore the browser Do-Not-Track setting (it is respected by default). |
| `data-endpoint="https://.../api/v1/collect"` | Send data to a different address. |

**Exclude your own staff devices:** open the website on that device and run
`localStorage.setItem('hv_ignore','1')` in the browser console once.

## 4. What is collected (and what is not)

| Collected | How |
|---|---|
| Random visitor ID | Cookie `_hv` (not linked to a name, email or phone) |
| Page path (without `?query` or `#hash`) | Tracker |
| Referrer website, campaign tags (`utm_source`, `utm_campaign`) | Tracker |
| Browser, operating system, device type | From the User-Agent, on the server |
| Country | From the CDN header, on the server |
| Language, time zone, screen width | Tracker |
| Visible time on page, button/phone/WhatsApp actions | Tracker |
| IP address | **Never stored.** Only a one-way keyed hash that changes every day, so it cannot follow anyone across days. |

Not collected: names, emails, phone numbers, form contents, booking details, full URLs with query strings.

Privacy notes: a visitor ID cookie and IP-derived data can count as personal data under Sri Lanka's PDPA
(Act No. 9 of 2022) and GDPR. This design minimises it (no raw IP, automatic deletion, no cross-site tracking),
but please mention analytics in your privacy policy. If you serve EU guests or add advertising, show a cookie banner and use
`data-require-consent="true"`.

## 5. Folder structure (Clean Architecture)

Dependencies only point **inward**: `interfaces` and `infrastructure` depend on `application`, which depends on `domain`.
The domain knows nothing about Express, SQLite or the web.

```
hotel-visitor-tracking-system/
├── src/
│   ├── domain/                      # Pure business rules. No libraries, no I/O.
│   │   ├── entities/                #   TrackingEvent (validated, immutable)
│   │   ├── value-objects/           #   VisitorId, SessionId, PagePath, EventName, CountryCode, ReportPeriod...
│   │   ├── services/                #   TrafficSourceClassifier (Google / Facebook / Booking.com / campaign...)
│   │   └── errors/                  #   ValidationError, AuthenticationError
│   ├── application/                 # Use cases + the interfaces (ports) they need.
│   │   ├── use-cases/               #   RecordTrackingEvent, GetDashboardAnalytics, AuthenticateAdmin,
│   │   │                            #   VerifyAdminSession, PurgeExpiredEvents
│   │   ├── ports/                   #   EventRepository, AnalyticsQuery, IpHasher, BotDetector, Clock...
│   │   └── dto/                     #   Dashboard response shape
│   ├── infrastructure/              # Concrete tools that implement the ports.
│   │   ├── persistence/sqlite/      #   migrations, repository, analytics queries
│   │   ├── security/                #   scrypt passwords, signed session tokens, IP hashing
│   │   ├── services/                #   user-agent parser, bot detector, system clock
│   │   ├── config/                  #   validated environment settings
│   │   └── logging/                 #   JSON logger (never logs visitor data)
│   ├── interfaces/http/             # Delivery mechanism (Express).
│   │   ├── controllers/             #   TrackingController, AdminController
│   │   ├── routes/                  #   tracking + admin routes
│   │   ├── middleware/              #   origin guard, rate limits, admin auth, CSRF header, error handler
│   │   ├── validation/              #   request schemas (zod)
│   │   ├── support/                 #   cookie + client-info helpers
│   │   └── createApp.ts             #   builds the Express app
│   └── main/                        # Composition root: the only place that wires everything together.
│       ├── container.ts
│       └── index.ts                 #   start-up, daily cleanup, graceful shutdown
├── public/
│   ├── tracker/hotel-tracker.js     # The script for the hotel website
│   └── admin/                       # Dashboard (login.html, index.html, dashboard.js, admin.css)
├── tests/                           # unit/ (domain, application, infrastructure) + integration/ (SQLite, HTTP)
├── scripts/hash-password.ts         # Creates ADMIN_PASSWORD_HASH
├── .env.example
└── package.json, tsconfig*.json, vitest.config.ts
```

Changing the database later (for example PostgreSQL) means writing two adapter classes in `infrastructure/persistence/`
and changing one line in `main/container.ts`. No business code changes.

## 6. Running in production

1. Run the app on a small server or VPS with `NODE_ENV=production` and keep it alive with `systemd` or `pm2`.
2. Put it behind **HTTPS** (nginx, Caddy or Cloudflare) on a sub-domain such as `analytics.yourhotel.com`,
   and set `TRUST_PROXY=1`.
3. Set `ALLOWED_ORIGINS` to the exact hotel website address (`https://www.yourhotel.com`).
4. **Backups:** copy the SQLite database with `sqlite3 data/analytics.db ".backup backup.db"` (safe while running), for example nightly.
5. Check health at `/health` (returns `{"status":"ok"}`).

Example nginx block:

```nginx
server {
  server_name analytics.yourhotel.com;
  listen 443 ssl;            # certificates via certbot
  location / {
    proxy_pass http://127.0.0.1:4000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $remote_addr;
  }
}
```

## 7. Security summary

- **Only your website can send data:** strict `Origin` check; other sites get 403.
- **Input is untrusted:** two validation layers (shape in the HTTP layer, business rules in the domain); invalid data is rejected or dropped, never stored.
- **SQL injection:** all queries are prepared statements with bound parameters; column names come from a fixed whitelist.
- **Dashboard XSS:** all visitor-supplied text is inserted with `textContent`, never as HTML; strict Content-Security-Policy.
- **Admin login:** scrypt password hashing, constant-time comparison, rate limit (10 failed attempts per 15 minutes), generic error message.
- **Admin session:** signed, expiring token in an `HttpOnly`, `SameSite=Strict`, `Secure` cookie scoped to `/admin`; extra CSRF header on state-changing requests; `Cache-Control: no-store`.
- **Abuse limits:** 2 KB request body limit, per-IP rate limit, bots and crawlers are ignored, event time always comes from the server clock.
- **Hardening:** Helmet security headers, no `X-Powered-By`, errors never leak internals.

## 8. Power and performance

- The tracker has **no timers or polling**; it sends only when something happens, using `sendBeacon` (a single small request, no CORS preflight).
- Server: SQLite in WAL mode with prepared statements reused for every request; the old-data cleanup wakes up once a day.
- Dashboard: refreshes every 30 s **only while the tab is visible**, and pauses in background tabs.
- Static files are cached; the tracker script is cached for a day.

## 9. Testing

`npm test` runs 112 automated tests: domain rules, use cases, security services, SQLite queries
(including local-midnight day boundaries) and the full HTTP flow from a guest visit to the dashboard numbers.
The tracker and dashboard were additionally verified end to end in a real Chromium browser.
