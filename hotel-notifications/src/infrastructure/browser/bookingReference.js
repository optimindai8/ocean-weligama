/** Creates a short, human-friendly booking reference such as "BK-261109-3F9A2C". */
export function generateBookingReference(now = new Date(), cryptoApi = globalThis.crypto) {
  const stamp = now.toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD
  const bytes = cryptoApi.getRandomValues(new Uint8Array(3));
  const suffix = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
  return `BK-${stamp}-${suffix}`;
}
