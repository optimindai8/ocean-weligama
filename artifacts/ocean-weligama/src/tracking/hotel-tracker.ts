/*!
 * Hotel Visitor Tracker v1 (TypeScript Module)
 * - First-party cookie (_hv) holding a random anonymous ID. No third-party requests.
 * - No timers, no polling: it only sends when something happens (page opened, page left, button clicked, or 40s active heartbeat).
 * - Uses navigator.sendBeacon: one tiny request that does not slow the page down.
 * - Excludes admin panel routes (/ow-admin, /admin, /manage) to strictly capture guest website statistics.
 */

declare global {
  interface Window {
    hotelTracker?: {
      track: (name: string) => void;
      consent: (granted: boolean) => void;
    };
  }
}

const COOKIE = '_hv';
const COOKIE_DAYS = 180;
const SESSION_KEY = 'hv_session';
const CONSENT_KEY = 'hv_consent';
const SESSION_IDLE_MS = 30 * 60 * 1000;
const MAX_SEGMENT_MS = 30 * 60 * 1000;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const IANA_MAP: Record<string, string> = {
  "Europe/Andorra": "AD", "Asia/Dubai": "AE", "Asia/Kabul": "AF", "America/Antigua": "AG", "America/Anguilla": "AI", "Europe/Tirane": "AL", "Asia/Yerevan": "AM", "Africa/Luanda": "AO", "Antarctica/McMurdo": "AQ", "Antarctica/Casey": "AQ", "Antarctica/Davis": "AQ", "Antarctica/DumontDUrville": "AQ", "Antarctica/Mawson": "AQ", "Antarctica/Palmer": "AQ", "Antarctica/Rothera": "AQ", "Antarctica/Syowa": "AQ", "Antarctica/Troll": "AQ", "Antarctica/Vostok": "AQ", "America/Argentina/Buenos_Aires": "AR", "America/Argentina/Cordoba": "AR", "America/Argentina/Salta": "AR", "America/Argentina/Jujuy": "AR", "America/Argentina/Tucuman": "AR", "America/Argentina/Catamarca": "AR", "America/Argentina/La_Rioja": "AR", "America/Argentina/San_Juan": "AR", "America/Argentina/Mendoza": "AR", "America/Argentina/San_Luis": "AR", "America/Argentina/Rio_Gallegos": "AR", "America/Argentina/Ushuaia": "AR", "Pacific/Pago_Pago": "AS", "Europe/Vienna": "AT", "Australia/Lord_Howe": "AU", "Antarctica/Macquarie": "AU", "Australia/Hobart": "AU", "Australia/Melbourne": "AU", "Australia/Sydney": "AU", "Australia/Broken_Hill": "AU", "Australia/Brisbane": "AU", "Australia/Lindeman": "AU", "Australia/Adelaide": "AU", "Australia/Darwin": "AU", "Australia/Perth": "AU", "Australia/Eucla": "AU", "America/Aruba": "AW", "Europe/Mariehamn": "AX", "Asia/Baku": "AZ", "Europe/Sarajevo": "BA", "America/Barbados": "BB", "Asia/Dhaka": "BD", "Europe/Brussels": "BE", "Africa/Ouagadougou": "BF", "Europe/Sofia": "BG", "Asia/Bahrain": "BH", "Africa/Bujumbura": "BI", "Africa/Porto-Novo": "BJ", "America/St_Barthelemy": "BL", "Atlantic/Bermuda": "BM", "Asia/Brunei": "BN", "America/La_Paz": "BO", "America/Kralendijk": "BQ", "America/Noronha": "BR", "America/Belem": "BR", "America/Fortaleza": "BR", "America/Recife": "BR", "America/Araguaina": "BR", "America/Maceio": "BR", "America/Bahia": "BR", "America/Sao_Paulo": "BR", "America/Campo_Grande": "BR", "America/Cuiaba": "BR", "America/Santarem": "BR", "America/Porto_Velho": "BR", "America/Boa_Vista": "BR", "America/Manaus": "BR", "America/Eirunepe": "BR", "America/Rio_Branco": "BR", "America/Nassau": "BS", "Asia/Thimphu": "BT", "Africa/Gaborone": "BW", "Europe/Minsk": "BY", "America/Belize": "BZ", "America/St_Johns": "CA", "America/Halifax": "CA", "America/Glace_Bay": "CA", "America/Moncton": "CA", "America/Goose_Bay": "CA", "America/Blanc-Sablon": "CA", "America/Toronto": "CA", "America/Iqaluit": "CA", "America/Atikokan": "CA", "America/Winnipeg": "CA", "America/Resolute": "CA", "America/Rankin_Inlet": "CA", "America/Regina": "CA", "America/Swift_Current": "CA", "America/Edmonton": "CA", "America/Cambridge_Bay": "CA", "America/Inuvik": "CA", "America/Vancouver": "CA", "America/Creston": "CA", "America/Dawson_Creek": "CA", "America/Fort_Nelson": "CA", "America/Whitehorse": "CA", "America/Dawson": "CA", "Indian/Cocos": "CC", "Africa/Kinshasa": "CD", "Africa/Lubumbashi": "CD", "Africa/Bangui": "CF", "Africa/Brazzaville": "CG", "Europe/Zurich": "CH", "Africa/Abidjan": "CI", "Pacific/Rarotonga": "CK", "America/Santiago": "CL", "America/Coyhaique": "CL", "America/Punta_Arenas": "CL", "Pacific/Easter": "CL", "Africa/Douala": "CM", "Asia/Shanghai": "CN", "Asia/Urumqi": "CN", "America/Bogota": "CO", "America/Costa_Rica": "CR", "America/Havana": "CU", "Atlantic/Cape_Verde": "CV", "America/Curacao": "CW", "Indian/Christmas": "CX", "Asia/Nicosia": "CY", "Asia/Famagusta": "CY", "Europe/Prague": "CZ", "Europe/Berlin": "DE", "Europe/Busingen": "DE", "Africa/Djibouti": "DJ", "Europe/Copenhagen": "DK", "America/Dominica": "DM", "America/Santo_Domingo": "DO", "Africa/Algiers": "DZ", "America/Guayaquil": "EC", "Pacific/Galapagos": "EC", "Europe/Tallinn": "EE", "Africa/Cairo": "EG", "Africa/El_Aaiun": "EH", "Africa/Asmara": "ER", "Europe/Madrid": "ES", "Africa/Ceuta": "ES", "Atlantic/Canary": "ES", "Africa/Addis_Ababa": "ET", "Europe/Helsinki": "FI", "Pacific/Fiji": "FJ", "Atlantic/Stanley": "FK", "Pacific/Chuuk": "FM", "Pacific/Pohnpei": "FM", "Pacific/Kosrae": "FM", "Atlantic/Faroe": "FO", "Europe/Paris": "FR", "Africa/Libreville": "GA", "Europe/London": "GB", "America/Grenada": "GD", "Asia/Tbilisi": "GE", "America/Cayenne": "GF", "Europe/Guernsey": "GG", "Africa/Accra": "GH", "Europe/Gibraltar": "GI", "America/Nuuk": "GL", "America/Danmarkshavn": "GL", "America/Scoresbysund": "GL", "America/Thule": "GL", "Africa/Banjul": "GM", "Africa/Conakry": "GN", "America/Guadeloupe": "GP", "Africa/Malabo": "GQ", "Europe/Athens": "GR", "Atlantic/South_Georgia": "GS", "America/Guatemala": "GT", "Pacific/Guam": "GU", "Africa/Bissau": "GW", "America/Guyana": "GY", "Asia/Hong_Kong": "HK", "America/Tegucigalpa": "HN", "Europe/Zagreb": "HR", "America/Port-au-Prince": "HT", "Europe/Budapest": "HU", "Asia/Jakarta": "ID", "Asia/Pontianak": "ID", "Asia/Makassar": "ID", "Asia/Jayapura": "ID", "Europe/Dublin": "IE", "Asia/Jerusalem": "IL", "Europe/Isle_of_Man": "IM", "Asia/Kolkata": "IN", "Indian/Chagos": "IO", "Asia/Baghdad": "IQ", "Asia/Tehran": "IR", "Atlantic/Reykjavik": "IS", "Europe/Rome": "IT", "Europe/Jersey": "JE", "America/Jamaica": "JM", "Asia/Amman": "JO", "Asia/Tokyo": "JP", "Africa/Nairobi": "KE", "Asia/Bishkek": "KG", "Asia/Phnom_Penh": "KH", "Pacific/Tarawa": "KI", "Pacific/Kanton": "KI", "Pacific/Kiritimati": "KI", "Indian/Comoro": "KM", "America/St_Kitts": "KN", "Asia/Pyongyang": "KP", "Asia/Seoul": "KR", "Asia/Kuwait": "KW", "America/Cayman": "KY", "Asia/Almaty": "KZ", "Asia/Qyzylorda": "KZ", "Asia/Qostanay": "KZ", "Asia/Aqtobe": "KZ", "Asia/Aqtau": "KZ", "Asia/Atyrau": "KZ", "Asia/Oral": "KZ", "Asia/Vientiane": "LA", "Asia/Beirut": "LB", "America/St_Lucia": "LC", "Europe/Vaduz": "LI", "Asia/Colombo": "LK", "Africa/Monrovia": "LR", "Africa/Maseru": "LS", "Europe/Vilnius": "LT", "Europe/Luxembourg": "LU", "Europe/Riga": "LV", "Africa/Tripoli": "LY", "Africa/Casablanca": "MA", "Europe/Monaco": "MC", "Europe/Chisinau": "MD", "Europe/Podgorica": "ME", "America/Marigot": "MF", "Indian/Antananarivo": "MG", "Pacific/Majuro": "MH", "Pacific/Kwajalein": "MH", "Europe/Skopje": "MK", "Africa/Bamako": "ML", "Asia/Yangon": "MM", "Asia/Ulaanbaatar": "MN", "Asia/Hovd": "MN", "Asia/Macau": "MO", "Pacific/Saipan": "MP", "America/Martinique": "MQ", "Africa/Nouakchott": "MR", "America/Montserrat": "MS", "Europe/Malta": "MT", "Indian/Mauritius": "MU", "Indian/Maldives": "MV", "Africa/Blantyre": "MW", "America/Mexico_City": "MX", "America/Cancun": "MX", "America/Merida": "MX", "America/Monterrey": "MX", "America/Matamoros": "MX", "America/Chihuahua": "MX", "America/Ciudad_Juarez": "MX", "America/Ojinaga": "MX", "America/Mazatlan": "MX", "America/Bahia_Banderas": "MX", "America/Hermosillo": "MX", "America/Tijuana": "MX", "Asia/Kuala_Lumpur": "MY", "Asia/Kuching": "MY", "Africa/Maputo": "MZ", "Africa/Windhoek": "NA", "Pacific/Noumea": "NC", "Africa/Niamey": "NE", "Pacific/Norfolk": "NF", "Africa/Lagos": "NG", "America/Managua": "NI", "Europe/Amsterdam": "NL", "Europe/Oslo": "NO", "Asia/Kathmandu": "NP", "Pacific/Nauru": "NR", "Pacific/Niue": "NU", "Pacific/Auckland": "NZ", "Pacific/Chatham": "NZ", "Asia/Muscat": "OM", "America/Panama": "PA", "America/Lima": "PE", "Pacific/Tahiti": "PF", "Pacific/Marquesas": "PF", "Pacific/Gambier": "PF", "Pacific/Port_Moresby": "PG", "Pacific/Bougainville": "PG", "Asia/Manila": "PH", "Asia/Karachi": "PK", "Europe/Warsaw": "PL", "America/Miquelon": "PM", "Pacific/Pitcairn": "PN", "America/Puerto_Rico": "PR", "Asia/Gaza": "PS", "Asia/Hebron": "PS", "Europe/Lisbon": "PT", "Atlantic/Madeira": "PT", "Atlantic/Azores": "PT", "Pacific/Palau": "PW", "America/Asuncion": "PY", "Asia/Qatar": "QA", "Indian/Reunion": "RE", "Europe/Bucharest": "RO", "Europe/Belgrade": "RS", "Europe/Kaliningrad": "RU", "Europe/Moscow": "RU", "Europe/Simferopol": "UA", "Europe/Kirov": "RU", "Europe/Volgograd": "RU", "Europe/Astrakhan": "RU", "Europe/Saratov": "RU", "Europe/Ulyanovsk": "RU", "Europe/Samara": "RU", "Asia/Yekaterinburg": "RU", "Asia/Omsk": "RU", "Asia/Novosibirsk": "RU", "Asia/Barnaul": "RU", "Asia/Tomsk": "RU", "Asia/Novokuznetsk": "RU", "Asia/Krasnoyarsk": "RU", "Asia/Irkutsk": "RU", "Asia/Chita": "RU", "Asia/Yakutsk": "RU", "Asia/Khandyga": "RU", "Asia/Vladivostok": "RU", "Asia/Ust-Nera": "RU", "Asia/Magadan": "RU", "Asia/Sakhalin": "RU", "Asia/Srednekolymsk": "RU", "Asia/Kamchatka": "RU", "Asia/Anadyr": "RU", "Africa/Kigali": "RW", "Asia/Riyadh": "SA", "Pacific/Guadalcanal": "SB", "Indian/Mahe": "SC", "Africa/Khartoum": "SD", "Europe/Stockholm": "SE", "Asia/Singapore": "SG", "Atlantic/St_Helena": "SH", "Europe/Ljubljana": "SI", "Arctic/Longyearbyen": "SJ", "Europe/Bratislava": "SK", "Africa/Freetown": "SL", "Europe/San_Marino": "SM", "Africa/Dakar": "SN", "Africa/Mogadishu": "SO", "America/Paramaribo": "SR", "Africa/Juba": "SS", "Africa/Sao_Tome": "ST", "America/El_Salvador": "SV", "America/Lower_Princes": "SX", "Asia/Damascus": "SY", "Africa/Mbabane": "SZ", "America/Grand_Turk": "TC", "Africa/Ndjamena": "TD", "Indian/Kerguelen": "TF", "Africa/Lome": "TG", "Asia/Bangkok": "TH", "Asia/Dushanbe": "TJ", "Pacific/Fakaofo": "TK", "Asia/Dili": "TL", "Asia/Ashgabat": "TM", "Africa/Tunis": "TN", "Pacific/Tongatapu": "TO", "Europe/Istanbul": "TR", "America/Port_of_Spain": "TT", "Pacific/Funafuti": "TV", "Asia/Taipei": "TW", "Africa/Dar_es_Salaam": "TZ", "Europe/Kyiv": "UA", "Africa/Kampala": "UG", "Pacific/Midway": "UM", "Pacific/Wake": "UM", "America/New_York": "US", "America/Detroit": "US", "America/Kentucky/Louisville": "US", "America/Kentucky/Monticello": "US", "America/Indiana/Indianapolis": "US", "America/Indiana/Vincennes": "US", "America/Indiana/Winamac": "US", "America/Indiana/Marengo": "US", "America/Indiana/Petersburg": "US", "America/Indiana/Vevay": "US", "America/Chicago": "US", "America/Indiana/Tell_City": "US", "America/Indiana/Knox": "US", "America/Menominee": "US", "America/North_Dakota/Center": "US", "America/North_Dakota/New_Salem": "US", "America/North_Dakota/Beulah": "US", "America/Denver": "US", "America/Boise": "US", "America/Phoenix": "US", "America/Los_Angeles": "US", "America/Anchorage": "US", "America/Juneau": "US", "America/Sitka": "US", "America/Metlakatla": "US", "America/Yakutat": "US", "America/Nome": "US", "America/Adak": "US", "Pacific/Honolulu": "US", "America/Montevideo": "UY", "Asia/Samarkand": "UZ", "Asia/Tashkent": "UZ", "Europe/Vatican": "VA", "America/St_Vincent": "VC", "America/Caracas": "VE", "America/Tortola": "VG", "America/St_Thomas": "VI", "Asia/Ho_Chi_Minh": "VN", "Pacific/Efate": "VU", "Pacific/Wallis": "WF", "Pacific/Apia": "WS", "Asia/Aden": "YE", "Indian/Mayotte": "YT", "Africa/Johannesburg": "ZA", "Africa/Lusaka": "ZM", "Africa/Harare": "ZW", "Europe/Kiev": "UA", "Asia/Calcutta": "IN", "Asia/Saigon": "VN", "Asia/Rangoon": "MM", "Asia/Katmandu": "NP", "Asia/Thimbu": "BT", "Asia/Ujung_Pandang": "ID", "America/Buenos_Aires": "AR", "America/Cordoba": "AR", "America/Rosario": "AR", "America/Jujuy": "AR", "America/Mendoza": "AR", "America/Catamarca": "AR", "America/Shiprock": "US", "America/Atka": "US", "America/Ensenada": "MX", "America/Santa_Isabel": "MX", "Pacific/Ponape": "FM", "Pacific/Truk": "FM", "Pacific/Yap": "FM", "Atlantic/Faeroe": "FO", "Atlantic/Jan_Mayen": "SJ"
};

function isAdminPath(p: string | null | undefined): boolean {
  if (!p) return false;
  const norm = p.toLowerCase();
  return norm.startsWith('/ow-admin') || norm.startsWith('/admin') || norm.startsWith('/manage');
}

function getStore(kind: 'localStorage' | 'sessionStorage'): Storage | null {
  try {
    const s = window[kind];
    s.setItem('__hv', '1');
    s.removeItem('__hv');
    return s;
  } catch {
    return null;
  }
}

const local = typeof window !== 'undefined' ? getStore('localStorage') : null;
const tab = typeof window !== 'undefined' ? getStore('sessionStorage') : null;
const memoryStore: Record<string, string> = {};

function read(s: Storage | null, key: string): string | null {
  try {
    return s ? s.getItem(key) : memoryStore[key] || null;
  } catch {
    return null;
  }
}

function write(s: Storage | null, key: string, value: string): void {
  try {
    if (s) s.setItem(key, value);
    else memoryStore[key] = value;
  } catch {}
}

function remove(s: Storage | null, key: string): void {
  try {
    if (s) s.removeItem(key);
    else delete memoryStore[key];
  } catch {}
}

function uuid(): string {
  if (typeof crypto !== 'undefined') {
    if (crypto.randomUUID) return crypto.randomUUID();
    const b = new Uint8Array(16);
    crypto.getRandomValues(b);
    b[6] = (b[6] & 15) | 64;
    b[8] = (b[8] & 63) | 128;
    const h = Array.from(b, (x) => ('0' + x.toString(16)).slice(-2)).join('');
    return [h.slice(0, 8), h.slice(8, 12), h.slice(12, 16), h.slice(16, 20), h.slice(20)].join('-');
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

function setCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return;
  document.cookie =
    name +
    '=' +
    encodeURIComponent(value) +
    '; Max-Age=' +
    Math.round(days * 86400) +
    '; Path=/; SameSite=Lax' +
    (location.protocol === 'https:' ? '; Secure' : '');
}

function detectClientCountry(): string {
  const stored = clientCountry || read(tab, 'hv_country');
  if (stored && stored.length === 2 && stored !== 'XX') return stored;

  try {
    const tz = (Intl && Intl.DateTimeFormat && Intl.DateTimeFormat().resolvedOptions().timeZone) || '';
    if (tz) {
      if (IANA_MAP[tz]) return IANA_MAP[tz];
      if (tz.startsWith('Australia/')) return 'AU';
      if (tz.startsWith('America/Indiana/') || tz.startsWith('America/Kentucky/') || tz.startsWith('America/North_Dakota/')) return 'US';
      if (tz.startsWith('America/Argentina/')) return 'AR';
      if (tz.startsWith('America/Canada/')) return 'CA';
      if (tz.startsWith('America/Mexico/')) return 'MX';
      if (tz.startsWith('Pacific/')) {
        const island = tz.replace('Pacific/', '');
        if (IANA_MAP['Pacific/' + island]) return IANA_MAP['Pacific/' + island];
      }
      if (tz.startsWith('Europe/')) {
        const city = tz.replace('Europe/', '');
        if (IANA_MAP['Europe/' + city]) return IANA_MAP['Europe/' + city];
      }
      if (tz.startsWith('Asia/')) {
        const acity = tz.replace('Asia/', '');
        if (IANA_MAP['Asia/' + acity]) return IANA_MAP['Asia/' + acity];
      }
    }
  } catch {}

  try {
    const langs = navigator.languages || [navigator.language || ''];
    for (const l of langs) {
      const m = (l || '').match(/[-_]([A-Za-z]{2})\b/);
      if (m && m[1] && m[1].length === 2) return m[1].toUpperCase();
    }
    const primary = (navigator.language || '').toLowerCase().split('-')[0];
    const LANG_MAP: Record<string, string> = {
      si: 'LK', ta: 'LK', de: 'DE', fr: 'FR', ja: 'JP', ru: 'RU', it: 'IT',
      nl: 'NL', pl: 'PL', sv: 'SE', da: 'DK', fi: 'FI', no: 'NO', nb: 'NO',
      cs: 'CZ', sk: 'SK', hu: 'HU', el: 'GR', pt: 'PT', uk: 'UA', ro: 'RO',
      bg: 'BG', ko: 'KR', zh: 'CN', th: 'TH', vi: 'VN', id: 'ID', ms: 'MY',
      hi: 'IN', bn: 'BD', ne: 'NP', ur: 'PK', he: 'IL', fa: 'IR', tr: 'TR', ar: 'AE',
    };
    if (LANG_MAP[primary]) return LANG_MAP[primary];
  } catch {}

  return 'LK';
}

let clientPublicIp: string | null = null;
let clientCountry: string | null = null;
let running = false;
let session: { id: string; vid: string; ret: boolean; ref: string; us: string; uc: string; t: number } | null = null;
let currentPath = '';
let visibleSince: number | null = null;
let accumulatedMs = 0;
const lastTrackTime: Record<string, number> = {};

function initGeolocation(): void {
  try {
    clientPublicIp = read(tab, 'hv_public_ip') || null;
    clientCountry = read(tab, 'hv_country') || null;

    if (!clientPublicIp || !clientCountry) {
      fetch('/api/v1/ip', { keepalive: true, credentials: 'omit' })
        .then((r) => r.json())
        .then((data) => {
          if (data && data.ip) {
            clientPublicIp = data.ip;
            write(tab, 'hv_public_ip', data.ip);
          }
          if (data && data.country && data.country.length === 2 && data.country !== 'XX') {
            clientCountry = data.country;
            write(tab, 'hv_country', data.country);
          }
        })
        .catch(() => {
          fetch('https://api64.ipify.org?format=json')
            .then((r) => r.json())
            .then((data) => {
              if (data && data.ip) {
                clientPublicIp = data.ip;
                write(tab, 'hv_public_ip', data.ip);
              }
            })
            .catch(() => {});
        });
    }
  } catch {}
}

function getVisitor(): { id: string; existed: boolean } {
  let id = getCookie(COOKIE);
  const existed = !!(id && UUID_REGEX.test(id));
  if (!existed || !id) id = uuid();
  setCookie(COOKIE, id, COOKIE_DAYS);
  return { id, existed };
}

function externalReferrer(): string {
  try {
    if (!document.referrer) return '';
    return new URL(document.referrer).hostname === location.hostname ? '' : document.referrer.slice(0, 500);
  } catch {
    return '';
  }
}

function startSession() {
  const visitor = getVisitor();
  const params = new URLSearchParams(location.search);
  return {
    id: uuid(),
    vid: visitor.id,
    ret: visitor.existed,
    ref: externalReferrer(),
    us: (params.get('utm_source') || '').slice(0, 100),
    uc: (params.get('utm_campaign') || '').slice(0, 150),
    t: Date.now(),
  };
}

function loadSession(): { id: string; vid: string; ret: boolean; ref: string; us: string; uc: string; t: number } {
  const raw = read(tab, SESSION_KEY);
  let s: { id: string; vid: string; ret: boolean; ref: string; us: string; uc: string; t: number } | null = null;
  if (raw) {
    try {
      s = JSON.parse(raw);
    } catch {}
  }
  if (!s || !UUID_REGEX.test(s.id) || !UUID_REGEX.test(s.vid) || Date.now() - s.t > SESSION_IDLE_MS) {
    s = startSession();
  }
  s.t = Date.now();
  write(tab, SESSION_KEY, JSON.stringify(s));
  return s;
}

function send(payload: Record<string, any>): void {
  if (!running || isAdminPath(payload.path)) return;
  const body = JSON.stringify(payload);
  const endpoint = '/api/v1/collect';
  try {
    if (navigator.sendBeacon && navigator.sendBeacon(endpoint, body)) return;
  } catch {}
  try {
    fetch(endpoint, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      keepalive: true,
      credentials: 'omit',
    }).catch(() => {});
  } catch {}
}

function base(type: string): Record<string, any> {
  const currentSession = loadSession();
  session = currentSession;
  const p: Record<string, any> = {
    type,
    visitorId: currentSession.vid,
    sessionId: currentSession.id,
    path: currentPath,
    returning: currentSession.ret,
    country: detectClientCountry(),
  };
  const resolvedIp = clientPublicIp || read(tab, 'hv_public_ip');
  if (resolvedIp) {
    p.ip = resolvedIp;
  }
  return p;
}

function sendPageview(): void {
  if (isAdminPath(currentPath)) return;
  const p = base('pageview');
  p.referrer = session?.ref || undefined;
  p.utmSource = session?.us || undefined;
  p.utmCampaign = session?.uc || undefined;
  p.screenWidth = window.screen && window.screen.width ? Math.round(window.screen.width) : undefined;
  p.language = navigator.language || undefined;
  try {
    p.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {}
  p.country = detectClientCountry();
  send(p);
}

export function track(name: string): void {
  if (!running || typeof name !== 'string' || isAdminPath(location.pathname)) return;
  const now = Date.now();
  if (lastTrackTime[name] && now - lastTrackTime[name] < 3000) return;
  lastTrackTime[name] = now;
  const p = base('event');
  p.name = name;
  send(p);
}

function takeSegment(): number {
  const now = Date.now();
  if (visibleSince !== null) {
    accumulatedMs += now - visibleSince;
    visibleSince = now;
  }
  const ms = accumulatedMs;
  accumulatedMs = 0;
  return Math.min(Math.round(ms), MAX_SEGMENT_MS);
}

function flushEngagement(): void {
  if (!running || isAdminPath(currentPath)) return;
  const ms = takeSegment();
  if (ms < 1000) return;
  const p = base('engagement');
  p.durationMs = ms;
  send(p);
}

function onVisibility(): void {
  if (document.visibilityState === 'hidden') {
    flushEngagement();
    visibleSince = null;
  } else if (visibleSince === null) {
    visibleSince = Date.now();
  }
}

function onNavigate(): void {
  if (location.pathname === currentPath) return;
  flushEngagement();
  currentPath = location.pathname;
  if (isAdminPath(currentPath)) return;
  if (!running && !isExcluded()) {
    start();
    return;
  }
  sendPageview();
}

function patchHistory(): void {
  (['pushState', 'replaceState'] as const).forEach((method) => {
    const original = history[method];
    history[method] = function (this: any, ...args: any[]) {
      const result = original.apply(this, args as any);
      onNavigate();
      return result;
    };
  });
  window.addEventListener('popstate', onNavigate);
}

function onClick(event: MouseEvent): void {
  if (isAdminPath(location.pathname)) return;
  const node = event.target as Element | null;
  if (!node || !node.closest) return;
  const el = node.closest('[data-track], a[href], button');
  if (!el) return;

  const custom = el.getAttribute('data-track');
  if (custom) return track(custom);

  const href = (el.getAttribute('href') || '').toLowerCase();
  if (href.startsWith('tel:')) return track('phone_click');
  if (href.startsWith('mailto:')) return track('email_click');
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|wa\.link)\//.test(href)) return track('whatsapp_click');
  if (href === '/book' || href.startsWith('/book') || href.startsWith('/booking')) return track('booking_click');

  const text = (el.textContent || '').trim().toLowerCase();
  if (text === 'book now' || text === 'book your stay' || text === 'reserve now' || text === 'check availability') {
    return track('booking_click');
  }
}

function isExcluded(): boolean {
  if (isAdminPath(location.pathname)) return true;
  if (read(local, 'hv_ignore') === '1') return true;
  return false;
}

function start(): void {
  if (running || isExcluded() || isAdminPath(location.pathname)) return;
  running = true;
  currentPath = location.pathname;
  visibleSince = document.visibilityState === 'hidden' ? null : Date.now();

  sendPageview();
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('pagehide', flushEngagement);
  window.addEventListener('pageshow', (e) => {
    if (e.persisted && visibleSince === null) visibleSince = Date.now();
  });
  document.addEventListener('click', onClick, true);
  patchHistory();

  // Flush engagement every 40s
  setInterval(() => {
    if (running && document.visibilityState === 'visible' && !isAdminPath(location.pathname)) {
      flushEngagement();
    }
  }, 40000);
}

export function initHotelTracker(): void {
  if (typeof window === 'undefined') return;

  initGeolocation();

  window.hotelTracker = {
    track,
    consent: (granted: boolean) => {
      write(local, CONSENT_KEY, granted ? '1' : '0');
      start();
    },
  };

  // Start if consent already granted or choice made
  if (read(local, CONSENT_KEY) !== null || read(local, 'ocean_air_cookie_consent') === 'accepted') {
    start();
  }
}
