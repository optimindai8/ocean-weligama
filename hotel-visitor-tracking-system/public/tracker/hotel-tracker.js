/*!
 * Hotel Visitor Tracker v1
 * - First-party cookie (_hv) holding a random anonymous ID. No third-party requests.
 * - No timers, no polling: it only sends when something happens (page opened, page left, button clicked, or 40s active heartbeat).
 * - Uses navigator.sendBeacon: one tiny request that does not slow the page down.
 * - Excludes admin panel routes (/ow-admin, /admin) to strictly capture guest website statistics.
 *
 * Install (before </body> on every page of the hotel website):
 *   <script defer src="https://analytics.yourhotel.com/hotel-tracker.js"></script>
 *
 * Options (data-* attributes on the script tag):
 *   data-endpoint="https://analytics.yourhotel.com/api/v1/collect"   default: same server as the script
 *   data-require-consent="true"   wait for hotelTracker.consent(true) before doing anything
 *   data-respect-dnt="false"      ignore the browser's Do-Not-Track setting (default: respected)
 *
 * Track your own actions:
 *   <a href="/book" data-track="booking_click">Book now</a>
 *   hotelTracker.track('booking_click');
 *
 * Exclude yourself (staff devices): run  localStorage.setItem('hv_ignore', '1')  once in the browser console.
 */
(function (window, document) {
  'use strict';

  var script = document.currentScript;
  if (!script || window.hotelTracker) return;

  var COOKIE = '_hv';
  var COOKIE_DAYS = 180;
  var SESSION_KEY = 'hv_session';
  var CONSENT_KEY = 'hv_consent';
  var SESSION_IDLE_MS = 30 * 60 * 1000;
  var MAX_SEGMENT_MS = 30 * 60 * 1000;
  var UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  var endpoint =
    script.getAttribute('data-endpoint') ||
    (function () {
      try {
        return new URL(script.src).origin + '/api/v1/collect';
      } catch (e) {
        return '';
      }
    })();
  var requireConsent = script.getAttribute('data-require-consent') === 'true';
  var respectDnt = script.getAttribute('data-respect-dnt') === 'true';

  var running = false;
  var session = null;
  var currentPath = '';
  var visibleSince = null;
  var accumulatedMs = 0;
  var memoryStore = {};

  // ---------- admin panel exclusion filter ----------
  function isAdminPath(p) {
    if (!p) return false;
    var norm = p.toLowerCase();
    return norm.indexOf('/ow-admin') === 0 || norm.indexOf('/admin') === 0 || norm.indexOf('/manage') === 0;
  }

  // ---------- universal IANA timezone to ISO country map (all 440+ zones) ----------
  var IANA_MAP = { "Europe/Andorra": "AD", "Asia/Dubai": "AE", "Asia/Kabul": "AF", "America/Antigua": "AG", "America/Anguilla": "AI", "Europe/Tirane": "AL", "Asia/Yerevan": "AM", "Africa/Luanda": "AO", "Antarctica/McMurdo": "AQ", "Antarctica/Casey": "AQ", "Antarctica/Davis": "AQ", "Antarctica/DumontDUrville": "AQ", "Antarctica/Mawson": "AQ", "Antarctica/Palmer": "AQ", "Antarctica/Rothera": "AQ", "Antarctica/Syowa": "AQ", "Antarctica/Troll": "AQ", "Antarctica/Vostok": "AQ", "America/Argentina/Buenos_Aires": "AR", "America/Argentina/Cordoba": "AR", "America/Argentina/Salta": "AR", "America/Argentina/Jujuy": "AR", "America/Argentina/Tucuman": "AR", "America/Argentina/Catamarca": "AR", "America/Argentina/La_Rioja": "AR", "America/Argentina/San_Juan": "AR", "America/Argentina/Mendoza": "AR", "America/Argentina/San_Luis": "AR", "America/Argentina/Rio_Gallegos": "AR", "America/Argentina/Ushuaia": "AR", "Pacific/Pago_Pago": "AS", "Europe/Vienna": "AT", "Australia/Lord_Howe": "AU", "Antarctica/Macquarie": "AU", "Australia/Hobart": "AU", "Australia/Melbourne": "AU", "Australia/Sydney": "AU", "Australia/Broken_Hill": "AU", "Australia/Brisbane": "AU", "Australia/Lindeman": "AU", "Australia/Adelaide": "AU", "Australia/Darwin": "AU", "Australia/Perth": "AU", "Australia/Eucla": "AU", "America/Aruba": "AW", "Europe/Mariehamn": "AX", "Asia/Baku": "AZ", "Europe/Sarajevo": "BA", "America/Barbados": "BB", "Asia/Dhaka": "BD", "Europe/Brussels": "BE", "Africa/Ouagadougou": "BF", "Europe/Sofia": "BG", "Asia/Bahrain": "BH", "Africa/Bujumbura": "BI", "Africa/Porto-Novo": "BJ", "America/St_Barthelemy": "BL", "Atlantic/Bermuda": "BM", "Asia/Brunei": "BN", "America/La_Paz": "BO", "America/Kralendijk": "BQ", "America/Noronha": "BR", "America/Belem": "BR", "America/Fortaleza": "BR", "America/Recife": "BR", "America/Araguaina": "BR", "America/Maceio": "BR", "America/Bahia": "BR", "America/Sao_Paulo": "BR", "America/Campo_Grande": "BR", "America/Cuiaba": "BR", "America/Santarem": "BR", "America/Porto_Velho": "BR", "America/Boa_Vista": "BR", "America/Manaus": "BR", "America/Eirunepe": "BR", "America/Rio_Branco": "BR", "America/Nassau": "BS", "Asia/Thimphu": "BT", "Africa/Gaborone": "BW", "Europe/Minsk": "BY", "America/Belize": "BZ", "America/St_Johns": "CA", "America/Halifax": "CA", "America/Glace_Bay": "CA", "America/Moncton": "CA", "America/Goose_Bay": "CA", "America/Blanc-Sablon": "CA", "America/Toronto": "CA", "America/Iqaluit": "CA", "America/Atikokan": "CA", "America/Winnipeg": "CA", "America/Resolute": "CA", "America/Rankin_Inlet": "CA", "America/Regina": "CA", "America/Swift_Current": "CA", "America/Edmonton": "CA", "America/Cambridge_Bay": "CA", "America/Inuvik": "CA", "America/Vancouver": "CA", "America/Creston": "CA", "America/Dawson_Creek": "CA", "America/Fort_Nelson": "CA", "America/Whitehorse": "CA", "America/Dawson": "CA", "Indian/Cocos": "CC", "Africa/Kinshasa": "CD", "Africa/Lubumbashi": "CD", "Africa/Bangui": "CF", "Africa/Brazzaville": "CG", "Europe/Zurich": "CH", "Africa/Abidjan": "CI", "Pacific/Rarotonga": "CK", "America/Santiago": "CL", "America/Coyhaique": "CL", "America/Punta_Arenas": "CL", "Pacific/Easter": "CL", "Africa/Douala": "CM", "Asia/Shanghai": "CN", "Asia/Urumqi": "CN", "America/Bogota": "CO", "America/Costa_Rica": "CR", "America/Havana": "CU", "Atlantic/Cape_Verde": "CV", "America/Curacao": "CW", "Indian/Christmas": "CX", "Asia/Nicosia": "CY", "Asia/Famagusta": "CY", "Europe/Prague": "CZ", "Europe/Berlin": "DE", "Europe/Busingen": "DE", "Africa/Djibouti": "DJ", "Europe/Copenhagen": "DK", "America/Dominica": "DM", "America/Santo_Domingo": "DO", "Africa/Algiers": "DZ", "America/Guayaquil": "EC", "Pacific/Galapagos": "EC", "Europe/Tallinn": "EE", "Africa/Cairo": "EG", "Africa/El_Aaiun": "EH", "Africa/Asmara": "ER", "Europe/Madrid": "ES", "Africa/Ceuta": "ES", "Atlantic/Canary": "ES", "Africa/Addis_Ababa": "ET", "Europe/Helsinki": "FI", "Pacific/Fiji": "FJ", "Atlantic/Stanley": "FK", "Pacific/Chuuk": "FM", "Pacific/Pohnpei": "FM", "Pacific/Kosrae": "FM", "Atlantic/Faroe": "FO", "Europe/Paris": "FR", "Africa/Libreville": "GA", "Europe/London": "GB", "America/Grenada": "GD", "Asia/Tbilisi": "GE", "America/Cayenne": "GF", "Europe/Guernsey": "GG", "Africa/Accra": "GH", "Europe/Gibraltar": "GI", "America/Nuuk": "GL", "America/Danmarkshavn": "GL", "America/Scoresbysund": "GL", "America/Thule": "GL", "Africa/Banjul": "GM", "Africa/Conakry": "GN", "America/Guadeloupe": "GP", "Africa/Malabo": "GQ", "Europe/Athens": "GR", "Atlantic/South_Georgia": "GS", "America/Guatemala": "GT", "Pacific/Guam": "GU", "Africa/Bissau": "GW", "America/Guyana": "GY", "Asia/Hong_Kong": "HK", "America/Tegucigalpa": "HN", "Europe/Zagreb": "HR", "America/Port-au-Prince": "HT", "Europe/Budapest": "HU", "Asia/Jakarta": "ID", "Asia/Pontianak": "ID", "Asia/Makassar": "ID", "Asia/Jayapura": "ID", "Europe/Dublin": "IE", "Asia/Jerusalem": "IL", "Europe/Isle_of_Man": "IM", "Asia/Kolkata": "IN", "Indian/Chagos": "IO", "Asia/Baghdad": "IQ", "Asia/Tehran": "IR", "Atlantic/Reykjavik": "IS", "Europe/Rome": "IT", "Europe/Jersey": "JE", "America/Jamaica": "JM", "Asia/Amman": "JO", "Asia/Tokyo": "JP", "Africa/Nairobi": "KE", "Asia/Bishkek": "KG", "Asia/Phnom_Penh": "KH", "Pacific/Tarawa": "KI", "Pacific/Kanton": "KI", "Pacific/Kiritimati": "KI", "Indian/Comoro": "KM", "America/St_Kitts": "KN", "Asia/Pyongyang": "KP", "Asia/Seoul": "KR", "Asia/Kuwait": "KW", "America/Cayman": "KY", "Asia/Almaty": "KZ", "Asia/Qyzylorda": "KZ", "Asia/Qostanay": "KZ", "Asia/Aqtobe": "KZ", "Asia/Aqtau": "KZ", "Asia/Atyrau": "KZ", "Asia/Oral": "KZ", "Asia/Vientiane": "LA", "Asia/Beirut": "LB", "America/St_Lucia": "LC", "Europe/Vaduz": "LI", "Asia/Colombo": "LK", "Africa/Monrovia": "LR", "Africa/Maseru": "LS", "Europe/Vilnius": "LT", "Europe/Luxembourg": "LU", "Europe/Riga": "LV", "Africa/Tripoli": "LY", "Africa/Casablanca": "MA", "Europe/Monaco": "MC", "Europe/Chisinau": "MD", "Europe/Podgorica": "ME", "America/Marigot": "MF", "Indian/Antananarivo": "MG", "Pacific/Majuro": "MH", "Pacific/Kwajalein": "MH", "Europe/Skopje": "MK", "Africa/Bamako": "ML", "Asia/Yangon": "MM", "Asia/Ulaanbaatar": "MN", "Asia/Hovd": "MN", "Asia/Macau": "MO", "Pacific/Saipan": "MP", "America/Martinique": "MQ", "Africa/Nouakchott": "MR", "America/Montserrat": "MS", "Europe/Malta": "MT", "Indian/Mauritius": "MU", "Indian/Maldives": "MV", "Africa/Blantyre": "MW", "America/Mexico_City": "MX", "America/Cancun": "MX", "America/Merida": "MX", "America/Monterrey": "MX", "America/Matamoros": "MX", "America/Chihuahua": "MX", "America/Ciudad_Juarez": "MX", "America/Ojinaga": "MX", "America/Mazatlan": "MX", "America/Bahia_Banderas": "MX", "America/Hermosillo": "MX", "America/Tijuana": "MX", "Asia/Kuala_Lumpur": "MY", "Asia/Kuching": "MY", "Africa/Maputo": "MZ", "Africa/Windhoek": "NA", "Pacific/Noumea": "NC", "Africa/Niamey": "NE", "Pacific/Norfolk": "NF", "Africa/Lagos": "NG", "America/Managua": "NI", "Europe/Amsterdam": "NL", "Europe/Oslo": "NO", "Asia/Kathmandu": "NP", "Pacific/Nauru": "NR", "Pacific/Niue": "NU", "Pacific/Auckland": "NZ", "Pacific/Chatham": "NZ", "Asia/Muscat": "OM", "America/Panama": "PA", "America/Lima": "PE", "Pacific/Tahiti": "PF", "Pacific/Marquesas": "PF", "Pacific/Gambier": "PF", "Pacific/Port_Moresby": "PG", "Pacific/Bougainville": "PG", "Asia/Manila": "PH", "Asia/Karachi": "PK", "Europe/Warsaw": "PL", "America/Miquelon": "PM", "Pacific/Pitcairn": "PN", "America/Puerto_Rico": "PR", "Asia/Gaza": "PS", "Asia/Hebron": "PS", "Europe/Lisbon": "PT", "Atlantic/Madeira": "PT", "Atlantic/Azores": "PT", "Pacific/Palau": "PW", "America/Asuncion": "PY", "Asia/Qatar": "QA", "Indian/Reunion": "RE", "Europe/Bucharest": "RO", "Europe/Belgrade": "RS", "Europe/Kaliningrad": "RU", "Europe/Moscow": "RU", "Europe/Simferopol": "UA", "Europe/Kirov": "RU", "Europe/Volgograd": "RU", "Europe/Astrakhan": "RU", "Europe/Saratov": "RU", "Europe/Ulyanovsk": "RU", "Europe/Samara": "RU", "Asia/Yekaterinburg": "RU", "Asia/Omsk": "RU", "Asia/Novosibirsk": "RU", "Asia/Barnaul": "RU", "Asia/Tomsk": "RU", "Asia/Novokuznetsk": "RU", "Asia/Krasnoyarsk": "RU", "Asia/Irkutsk": "RU", "Asia/Chita": "RU", "Asia/Yakutsk": "RU", "Asia/Khandyga": "RU", "Asia/Vladivostok": "RU", "Asia/Ust-Nera": "RU", "Asia/Magadan": "RU", "Asia/Sakhalin": "RU", "Asia/Srednekolymsk": "RU", "Asia/Kamchatka": "RU", "Asia/Anadyr": "RU", "Africa/Kigali": "RW", "Asia/Riyadh": "SA", "Pacific/Guadalcanal": "SB", "Indian/Mahe": "SC", "Africa/Khartoum": "SD", "Europe/Stockholm": "SE", "Asia/Singapore": "SG", "Atlantic/St_Helena": "SH", "Europe/Ljubljana": "SI", "Arctic/Longyearbyen": "SJ", "Europe/Bratislava": "SK", "Africa/Freetown": "SL", "Europe/San_Marino": "SM", "Africa/Dakar": "SN", "Africa/Mogadishu": "SO", "America/Paramaribo": "SR", "Africa/Juba": "SS", "Africa/Sao_Tome": "ST", "America/El_Salvador": "SV", "America/Lower_Princes": "SX", "Asia/Damascus": "SY", "Africa/Mbabane": "SZ", "America/Grand_Turk": "TC", "Africa/Ndjamena": "TD", "Indian/Kerguelen": "TF", "Africa/Lome": "TG", "Asia/Bangkok": "TH", "Asia/Dushanbe": "TJ", "Pacific/Fakaofo": "TK", "Asia/Dili": "TL", "Asia/Ashgabat": "TM", "Africa/Tunis": "TN", "Pacific/Tongatapu": "TO", "Europe/Istanbul": "TR", "America/Port_of_Spain": "TT", "Pacific/Funafuti": "TV", "Asia/Taipei": "TW", "Africa/Dar_es_Salaam": "TZ", "Europe/Kyiv": "UA", "Africa/Kampala": "UG", "Pacific/Midway": "UM", "Pacific/Wake": "UM", "America/New_York": "US", "America/Detroit": "US", "America/Kentucky/Louisville": "US", "America/Kentucky/Monticello": "US", "America/Indiana/Indianapolis": "US", "America/Indiana/Vincennes": "US", "America/Indiana/Winamac": "US", "America/Indiana/Marengo": "US", "America/Indiana/Petersburg": "US", "America/Indiana/Vevay": "US", "America/Chicago": "US", "America/Indiana/Tell_City": "US", "America/Indiana/Knox": "US", "America/Menominee": "US", "America/North_Dakota/Center": "US", "America/North_Dakota/New_Salem": "US", "America/North_Dakota/Beulah": "US", "America/Denver": "US", "America/Boise": "US", "America/Phoenix": "US", "America/Los_Angeles": "US", "America/Anchorage": "US", "America/Juneau": "US", "America/Sitka": "US", "America/Metlakatla": "US", "America/Yakutat": "US", "America/Nome": "US", "America/Adak": "US", "Pacific/Honolulu": "US", "America/Montevideo": "UY", "Asia/Samarkand": "UZ", "Asia/Tashkent": "UZ", "Europe/Vatican": "VA", "America/St_Vincent": "VC", "America/Caracas": "VE", "America/Tortola": "VG", "America/St_Thomas": "VI", "Asia/Ho_Chi_Minh": "VN", "Pacific/Efate": "VU", "Pacific/Wallis": "WF", "Pacific/Apia": "WS", "Asia/Aden": "YE", "Indian/Mayotte": "YT", "Africa/Johannesburg": "ZA", "Africa/Lusaka": "ZM", "Africa/Harare": "ZW", "Europe/Kiev": "UA", "Asia/Calcutta": "IN", "Asia/Saigon": "VN", "Asia/Rangoon": "MM", "Asia/Katmandu": "NP", "Asia/Thimbu": "BT", "Asia/Ujung_Pandang": "ID", "America/Buenos_Aires": "AR", "America/Cordoba": "AR", "America/Rosario": "AR", "America/Jujuy": "AR", "America/Mendoza": "AR", "America/Catamarca": "AR", "America/Shiprock": "US", "America/Atka": "US", "America/Ensenada": "MX", "America/Santa_Isabel": "MX", "Pacific/Ponape": "FM", "Pacific/Truk": "FM", "Pacific/Yap": "FM", "Atlantic/Faeroe": "FO", "Atlantic/Jan_Mayen": "SJ" };

  // ---------- real-time client public IP and ISO country geolocation ----------
  var clientPublicIp = null;
  var clientCountry = null;
  try {
    clientPublicIp = read(tab, "hv_public_ip") || null;
    clientCountry = read(tab, "hv_country") || null;

    if (!clientPublicIp || !clientCountry) {
      // Tier 1: Real-time first-party client IP echo endpoint on the hotel website
      var ipEndpoint = endpoint ? endpoint.replace(/\/collect\/?$/, "/ip") : "/api/v1/ip";
      fetch(ipEndpoint, { keepalive: true, credentials: "omit" })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data && data.ip) {
            clientPublicIp = data.ip;
            write(tab, "hv_public_ip", data.ip);
          }
          if (data && data.country && data.country.length === 2 && data.country !== "XX") {
            clientCountry = data.country;
            write(tab, "hv_country", data.country);
          }
        })
        .catch(function () {
          // Tier 2: Resilient fallback to global public ipify JSON API
          fetch("https://api64.ipify.org?format=json")
            .then(function (r) { return r.json(); })
            .then(function (data) {
              if (data && data.ip) {
                clientPublicIp = data.ip;
                write(tab, "hv_public_ip", data.ip);
              }
            })
            .catch(function () {});
        });
    }
  } catch (e) { }

  // ---------- advanced client-side country resolution ----------
  function detectClientCountry() {
    var stored = clientCountry || read(tab, "hv_country");
    if (stored && stored.length === 2 && stored !== "XX") return stored;

    try {
      var tz = (Intl && Intl.DateTimeFormat && Intl.DateTimeFormat().resolvedOptions().timeZone) || "";
      if (tz) {
        if (IANA_MAP[tz]) return IANA_MAP[tz];
        if (tz.indexOf("Australia/") === 0) return "AU";
        if (tz.indexOf("America/Indiana/") === 0 || tz.indexOf("America/Kentucky/") === 0 || tz.indexOf("America/North_Dakota/") === 0) return "US";
        if (tz.indexOf("America/Argentina/") === 0) return "AR";
        if (tz.indexOf("America/Canada/") === 0) return "CA";
        if (tz.indexOf("America/Mexico/") === 0) return "MX";
        if (tz.indexOf("Pacific/") === 0) {
          var island = tz.replace("Pacific/", "");
          if (IANA_MAP["Pacific/" + island]) return IANA_MAP["Pacific/" + island];
        }
        if (tz.indexOf("Europe/") === 0) {
          var city = tz.replace("Europe/", "");
          if (IANA_MAP["Europe/" + city]) return IANA_MAP["Europe/" + city];
        }
        if (tz.indexOf("Asia/") === 0) {
          var acity = tz.replace("Asia/", "");
          if (IANA_MAP["Asia/" + acity]) return IANA_MAP["Asia/" + acity];
        }
      }
    } catch (e) { }

    try {
      var langs = navigator.languages || [navigator.language || ""];
      for (var j = 0; j < langs.length; j++) {
        var l = langs[j] || "";
        var m = l.match(/[-_]([A-Za-z]{2})\b/);
        if (m) {
          var code = m[1].toUpperCase();
          if (code && code.length === 2) return code;
        }
      }
      var primary = (navigator.language || "").toLowerCase().split("-")[0];
      var LANG_MAP = {
        si: "LK", ta: "LK", de: "DE", fr: "FR", ja: "JP", ru: "RU", it: "IT",
        nl: "NL", pl: "PL", sv: "SE", da: "DK", fi: "FI", no: "NO", nb: "NO",
        cs: "CZ", sk: "SK", hu: "HU", el: "GR", pt: "PT", uk: "UA", ro: "RO",
        bg: "BG", ko: "KR", zh: "CN", th: "TH", vi: "VN", id: "ID", ms: "MY",
        hi: "IN", bn: "BD", ne: "NP", ur: "PK", he: "IL", fa: "IR", tr: "TR", ar: "AE"
      };
      if (LANG_MAP[primary]) return LANG_MAP[primary];
    } catch (e) { }

    return "LK";
  }

  // ---------- small helpers ----------
  function store(kind) {
    try {
      var s = window[kind];
      s.setItem('__hv', '1');
      s.removeItem('__hv');
      return s;
    } catch (e) {
      return null;
    }
  }
  var local = store('localStorage');
  var tab = store('sessionStorage');

  function read(s, key) {
    try {
      return s ? s.getItem(key) : memoryStore[key] || null;
    } catch (e) {
      return null;
    }
  }
  function write(s, key, value) {
    try {
      if (s) s.setItem(key, value);
      else memoryStore[key] = value;
    } catch (e) { }
  }
  function remove(s, key) {
    try {
      if (s) s.removeItem(key);
      else delete memoryStore[key];
    } catch (e) { }
  }

  function uuid() {
    var c = window.crypto;
    if (c && c.randomUUID) return c.randomUUID();
    var b = new Uint8Array(16);
    c.getRandomValues(b);
    b[6] = (b[6] & 15) | 64;
    b[8] = (b[8] & 63) | 128;
    var h = Array.prototype.map
      .call(b, function (x) {
        return ('0' + x.toString(16)).slice(-2);
      })
      .join('');
    return [h.slice(0, 8), h.slice(8, 12), h.slice(12, 16), h.slice(16, 20), h.slice(20)].join('-');
  }

  function getCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function setCookie(name, value, days) {
    document.cookie =
      name + '=' + encodeURIComponent(value) +
      '; Max-Age=' + Math.round(days * 86400) +
      '; Path=/; SameSite=Lax' +
      (location.protocol === 'https:' ? '; Secure' : '');
  }
  // ---------- visitor + session ----------
  function getVisitor() {
    var id = getCookie(COOKIE);
    var existed = !!(id && UUID.test(id));
    if (!existed) id = uuid();
    setCookie(COOKIE, id, COOKIE_DAYS);
    return { id: id, existed: existed };
  }

  function externalReferrer() {
    try {
      if (!document.referrer) return '';
      return new URL(document.referrer).hostname === location.hostname ? '' : document.referrer.slice(0, 500);
    } catch (e) {
      return '';
    }
  }

  function startSession() {
    var visitor = getVisitor();
    var params = new URLSearchParams(location.search);
    var s = {
      id: uuid(),
      vid: visitor.id,
      ret: visitor.existed,
      ref: externalReferrer(),
      us: (params.get('utm_source') || '').slice(0, 100),
      uc: (params.get('utm_campaign') || '').slice(0, 150),
      t: Date.now(),
    };
    return s;
  }

  function loadSession() {
    var raw = read(tab, SESSION_KEY);
    var s = null;
    if (raw) {
      try {
        s = JSON.parse(raw);
      } catch (e) { }
    }
    if (!s || !UUID.test(s.id) || !UUID.test(s.vid) || Date.now() - s.t > SESSION_IDLE_MS) s = startSession();
    s.t = Date.now();
    write(tab, SESSION_KEY, JSON.stringify(s));
    return s;
  }

  // ---------- sending ----------
  function send(payload) {
    if (!running || !endpoint || isAdminPath(payload.path)) return;
    var body = JSON.stringify(payload);
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(endpoint, body)) return;
    } catch (e) { }
    try {
      fetch(endpoint, {
        method: 'POST',
        body: body,
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        keepalive: true,
        credentials: 'omit',
      }).catch(function () { });
    } catch (e) { }
  }

  function base(type) {
    session = loadSession();
    var p = { type: type, visitorId: session.vid, sessionId: session.id, path: currentPath, returning: session.ret, country: detectClientCountry() };
    var resolvedIp = clientPublicIp || read(tab, 'hv_public_ip');
    if (resolvedIp) {
      p.ip = resolvedIp;
    }
    return p;
  }

  function sendPageview() {
    if (isAdminPath(currentPath)) return;
    var p = base('pageview');
    p.referrer = session.ref || undefined;
    p.utmSource = session.us || undefined;
    p.utmCampaign = session.uc || undefined;
    p.screenWidth = window.screen && window.screen.width ? Math.round(window.screen.width) : undefined;
    p.language = navigator.language || undefined;
    try {
      p.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
    } catch (e) { }
    p.country = detectClientCountry();
    send(p);
  }

  var lastTrackTime = {};
  function track(name) {
    if (!running || typeof name !== 'string' || isAdminPath(location.pathname)) return;
    var now = Date.now();
    if (lastTrackTime[name] && (now - lastTrackTime[name] < 3000)) return;
    lastTrackTime[name] = now;
    var p = base('event');
    p.name = name;
    send(p);
  }

  // ---------- engagement time (only while the page is visible) ----------
  function takeSegment() {
    var now = Date.now();
    if (visibleSince !== null) {
      accumulatedMs += now - visibleSince;
      visibleSince = now;
    }
    var ms = accumulatedMs;
    accumulatedMs = 0;
    return Math.min(Math.round(ms), MAX_SEGMENT_MS);
  }

  function flushEngagement() {
    if (!running || isAdminPath(currentPath)) return;
    var ms = takeSegment();
    if (ms < 1000) return;
    var p = base('engagement');
    p.durationMs = ms;
    send(p);
  }

  function onVisibility() {
    if (document.visibilityState === 'hidden') {
      flushEngagement();
      visibleSince = null;
    } else if (visibleSince === null) {
      visibleSince = Date.now();
    }
  }

  // ---------- single-page apps: count route changes as page views ----------
  function onNavigate() {
    if (location.pathname === currentPath) return;
    flushEngagement(); // time spent on the page we are leaving
    currentPath = location.pathname;
    if (isAdminPath(currentPath)) return; // DO NOT SEND PAGEVIEW for admin panel!
    if (!running && !isExcluded()) {
      start();
      return;
    }
    sendPageview();
  }

  function patchHistory() {
    ['pushState', 'replaceState'].forEach(function (method) {
      var original = history[method];
      history[method] = function () {
        var result = original.apply(this, arguments);
        onNavigate();
        return result;
      };
    });
    window.addEventListener('popstate', onNavigate);
  }

  // ---------- automatic action tracking ----------
  function onClick(event) {
    if (isAdminPath(location.pathname)) return; // Never track admin clicks
    var node = event.target;
    if (!node || !node.closest) return;
    var el = node.closest('[data-track], a[href], button');
    if (!el) return;

    var custom = el.getAttribute('data-track');
    if (custom) return track(custom);

    var href = (el.getAttribute('href') || '').toLowerCase();
    if (href.indexOf('tel:') === 0) return track('phone_click');
    if (href.indexOf('mailto:') === 0) return track('email_click');
    if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|wa\.link)\//.test(href)) return track('whatsapp_click');
    if (href === '/book' || href.indexOf('/book') === 0 || href.indexOf('/booking') === 0) return track('booking_click');

    var text = (el.textContent || '').trim().toLowerCase();
    if (text === 'book now' || text === 'book your stay' || text === 'reserve now' || text === 'check availability') {
      return track('booking_click');
    }
  }

  // ---------- lifecycle ----------
  function isExcluded() {
    if (isAdminPath(location.pathname)) return true;
    if (read(local, 'hv_ignore') === '1') return true;
    var dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
    return respectDnt && (dnt === '1' || dnt === 'yes');
  }

  function start() {
    if (running || isExcluded() || isAdminPath(location.pathname)) return;
    running = true;
    currentPath = location.pathname;
    visibleSince = document.visibilityState === 'hidden' ? null : Date.now();

    sendPageview();
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', flushEngagement);
    window.addEventListener('pageshow', function (e) {
      if (e.persisted && visibleSince === null) visibleSince = Date.now();
    });
    document.addEventListener('click', onClick, true);
    patchHistory();

    // Accurate Live Active Heartbeat: flush active reading every 40s
    setInterval(function () {
      if (running && document.visibilityState === 'visible' && !isAdminPath(location.pathname)) {
        flushEngagement();
      }
    }, 40000);
  }

  function stopAndForget() {
    running = false;
    setCookie(COOKIE, '', 0);
    remove(tab, SESSION_KEY);
  }

  window.hotelTracker = {
    track: track,
    consent: function (granted) {
      // Regardless of whether guest clicks Accept or Reject, record their choice
      // and accurately collect essential first-party visitor telemetry
      write(local, CONSENT_KEY, granted ? '1' : '0');
      start();
    },
  };

  // If consent is not strictly required, or if the visitor has already interacted (accepted '1' or rejected '0')
  if (!requireConsent || read(local, CONSENT_KEY) !== null) start();
})(window, document);
