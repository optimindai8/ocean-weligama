/** Display formatters for values that end up inside the emails. */
export function createFormatters({ locale, timeZone, currency }) {
  const dateTime = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
    timeZoneName: 'short',
  });
  const calendarDate = new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC' });
  const money = new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 });

  return Object.freeze({
    dateTime: (date) => dateTime.format(date),
    calendarDate: (isoDate) => calendarDate.format(new Date(`${isoDate}T00:00:00Z`)),
    money: (amount) => money.format(amount),
  });
}
