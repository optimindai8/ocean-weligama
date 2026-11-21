// Admin dashboard. Plain browser JavaScript, no framework, no external requests.
// SECURITY: every piece of data is inserted with textContent / setAttribute, never innerHTML.
// Page paths, referrers and event names come from visitors and must be treated as untrusted.

const REFRESH_MS = 30_000;
const PERIOD_KEY = 'hv_admin_period';
const PERIODS = ['today', '7d', '30d', '90d'];

const EVENT_LABELS = {
  booking_click: 'Booking button clicks',
  phone_click: 'Phone number taps',
  whatsapp_click: 'WhatsApp clicks',
  email_click: 'Email clicks',
  contact_submit: 'Contact form sent',
};
const MEDIUM_LABELS = {
  direct: 'Direct (typed or bookmarked)',
  organic: 'Search engines',
  social: 'Social media',
  travel: 'Travel & booking sites',
  referral: 'Other websites',
  campaign: 'Campaign links',
};

const numberFormat = new Intl.NumberFormat();
const regionNames = typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames(['en'], { type: 'region' }) : null;

let period = loadPeriod();
let timer = null;
let loading = false;

const $ = (selector) => document.querySelector(selector);

function loadPeriod() {
  try {
    const saved = localStorage.getItem(PERIOD_KEY);
    return PERIODS.includes(saved) ? saved : '7d';
  } catch {
    return '7d';
  }
}

function el(tag, attributes = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  node.append(...children);
  return node;
}

function svg(tag, attributes = {}) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
  return node;
}

// ---------- formatting ----------
const formatNumber = (n) => numberFormat.format(n);

function formatDuration(seconds) {
  if (!seconds) return '–';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${String(s).padStart(2, '0')}s` : `${s}s`;
}

function formatDay(isoDate) {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function countryName(code) {
  if (code === 'Unknown') return 'Unknown';
  try {
    return regionNames?.of(code) ?? code;
  } catch {
    return code;
  }
}

function prettyEvent(name) {
  return EVENT_LABELS[name] ?? name.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
}

// ---------- rendering ----------
function setText(selector, text) {
  $(selector).textContent = text;
}

function renderBars(selector, items, { label = (x) => x, showViews = false, empty = 'No data yet.' } = {}) {
  const host = $(selector);
  host.replaceChildren();
  if (!items.length) {
    host.append(el('p', { class: 'empty' }, empty));
    return;
  }
  const max = Math.max(...items.map((item) => item.visitors), 1);
  const list = el('ol', { class: 'bars' });
  for (const item of items) {
    const text = label(item.label);
    const value = el('span', { class: 'bar-value' }, formatNumber(item.visitors));
    if (showViews) value.append(el('small', {}, `${formatNumber(item.views)} ${item.views === 1 ? 'view' : 'views'}`));
    const fill = el('span', { class: 'bar-fill' });
    fill.style.width = `${Math.max(2, Math.round((item.visitors / max) * 100))}%`;
    list.append(
      el('li', {}, el('span', { class: 'bar-label', title: text }, text), value, el('span', { class: 'bar-track' }, fill)),
    );
  }
  host.append(list);
}

// The axis has 4 equal gaps, so pick a whole-number step and use 4 x step as the maximum.
// This keeps every gridline label a clean integer (0, 1, 2, 3, 4 / 0, 5, 10, 15, 20 / ...).
function niceMax(value) {
  const rough = Math.max(value / 4, 1); // visitors are whole numbers: never use a step below 1
  const power = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 5, 10].map((m) => m * power).find((s) => s >= rough) ?? 10 * power;
  return step * 4;
}

function renderChart(daily) {
  const host = $('#chart');
  host.replaceChildren();

  const width = 720;
  const height = 230;
  const left = 34;
  const top = 10;
  const bottom = 26;
  const plotW = width - left;
  const plotH = height - top - bottom;
  const max = niceMax(Math.max(...daily.map((d) => d.visitors), 0));

  const total = daily.reduce((sum, d) => sum + d.visitors, 0);
  const chart = svg('svg', {
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': `Daily visitors for the last ${daily.length} day${daily.length === 1 ? '' : 's'}. ${total} visits in total.`,
  });

  for (let i = 0; i <= 4; i++) {
    const y = top + plotH - (plotH * i) / 4;
    chart.append(svg('line', { class: 'grid', x1: left, x2: width, y1: y, y2: y }));
    const tick = svg('text', { class: 'tick', x: left - 6, y: y + 4, 'text-anchor': 'end' });
    tick.textContent = formatNumber(Math.round((max * i) / 4));
    chart.append(tick);
  }

  const slot = plotW / daily.length;
  const barWidth = Math.min(56, slot * 0.72);
  daily.forEach((day, index) => {
    const barHeight = (day.visitors / max) * plotH;
    const x = left + slot * index + (slot - barWidth) / 2;
    const bar = svg('rect', {
      class: 'bar',
      x,
      y: top + plotH - barHeight,
      width: barWidth,
      height: Math.max(barHeight, day.visitors > 0 ? 2 : 0),
      rx: 2,
    });
    const title = svg('title');
    title.textContent = `${formatDay(day.date)}: ${formatNumber(day.visitors)} visitors, ${formatNumber(day.pageViews)} page views`;
    bar.append(title);
    chart.append(bar);
  });

  const labelIndexes = daily.length === 1 ? [0] : [...new Set([0, Math.floor((daily.length - 1) / 2), daily.length - 1])];
  for (const index of labelIndexes) {
    const label = svg('text', {
      class: 'tick',
      x: left + slot * index + slot / 2,
      y: height - 6,
      'text-anchor': index === 0 && daily.length > 1 ? 'start' : index === daily.length - 1 && daily.length > 1 ? 'end' : 'middle',
    });
    label.textContent = formatDay(daily[index].date);
    chart.append(label);
  }

  host.append(chart);
}

function render(data) {
  const s = data.summary;

  setText('#range-label', `${formatDay(data.daily[0].date)} – ${formatDay(data.daily[data.daily.length - 1].date)}`);
  setText('#kpi-online', formatNumber(data.onlineNow));
  setText('#kpi-visitors', formatNumber(s.visitors));
  setText('#kpi-visitors-hint', `${formatNumber(s.newVisitors)} new`);
  setText('#kpi-views', formatNumber(s.pageViews));
  setText('#kpi-views-hint', `${s.pagesPerSession} pages per visit`);
  setText('#kpi-sessions', formatNumber(s.sessions));
  setText('#kpi-returning', s.visitors ? `${Math.round((s.returningVisitors / s.visitors) * 100)}%` : '–');
  setText('#kpi-returning-hint', `${formatNumber(s.returningVisitors)} of ${formatNumber(s.visitors)} visitors`);
  setText('#kpi-time', formatDuration(s.avgEngagedSeconds));

  renderChart(data.daily);

  renderBars('#events', data.events.map((e) => ({ label: e.name, visitors: e.visitors, views: e.count })), {
    label: prettyEvent,
    empty: 'No guest actions recorded yet.',
  });
  renderBars('#pages', data.topPages, { showViews: true });
  renderBars('#mediums', data.mediums, { label: (m) => MEDIUM_LABELS[m] ?? m });
  renderBars('#sources', data.sources);
  renderBars('#countries', data.countries, {
    label: countryName,
    empty: 'Country data is not available. Serve the app behind Cloudflare (or set COUNTRY_HEADER).',
  });
  renderBars('#devices', data.devices, { label: (d) => d.charAt(0).toUpperCase() + d.slice(1) });
  renderBars('#browsers', data.browsers);
  renderBars('#systems', data.operatingSystems);
}

// ---------- data loading ----------
function setStatus(message, isError = false) {
  const node = $('#status');
  node.textContent = message;
  node.dataset.error = String(isError);
}

async function load() {
  if (loading) return;
  loading = true;
  clearTimeout(timer);
  try {
    const response = await fetch(`/admin/api/analytics?period=${encodeURIComponent(period)}`, {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    });
    if (response.status === 401) {
      location.replace('/admin/login.html');
      return;
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    render(await response.json());
    setStatus(`Updated ${new Date().toLocaleTimeString()}`);
  } catch {
    setStatus('Could not refresh the numbers. Trying again shortly…', true);
  } finally {
    loading = false;
    scheduleRefresh();
  }
}

// Refresh only while the tab is visible: a background tab costs the server (and the battery) nothing.
function scheduleRefresh() {
  clearTimeout(timer);
  if (document.visibilityState === 'visible') timer = setTimeout(load, REFRESH_MS);
}

function selectPeriod(next) {
  period = next;
  try {
    localStorage.setItem(PERIOD_KEY, next);
  } catch {
    /* storage unavailable: the choice just is not remembered */
  }
  for (const button of document.querySelectorAll('#periods button')) {
    button.setAttribute('aria-pressed', String(button.dataset.period === next));
  }
  load();
}

$('#periods').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-period]');
  if (button) selectPeriod(button.dataset.period);
});

$('#logout').addEventListener('click', async () => {
  try {
    await fetch('/admin/api/logout', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'hotel-admin' },
      body: '{}',
    });
  } finally {
    location.replace('/admin/login.html');
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') load();
  else clearTimeout(timer);
});

selectPeriod(period);
