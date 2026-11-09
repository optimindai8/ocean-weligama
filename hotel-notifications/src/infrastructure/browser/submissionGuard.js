/**
 * Submission guard for bot defense and double-click / cooldown protection.
 * Protects EmailJS monthly quota (200 requests/month).
 */

const DEFAULT_COOLDOWN_MS = 30_000;

/** Checks if a hidden honeypot field has been filled by a bot. */
export function isHoneypotTripped(valOrForm) {
  if (!valOrForm) return false;
  if (typeof valOrForm === 'string') return valOrForm.trim().length > 0;
  if (valOrForm.elements && valOrForm.elements.hp_field) {
    return Boolean(valOrForm.elements.hp_field.value);
  }
  return false;
}

/**
 * Creates a cooldown submission guard using browser sessionStorage.
 *
 * @param {{ key: string, cooldownMs?: number }} options
 */
export function createSubmissionGuard({ key, cooldownMs = DEFAULT_COOLDOWN_MS }) {
  const read = () => {
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) return 0;
      return Number(window.sessionStorage.getItem(key)) || 0;
    } catch {
      return 0; // Private browsing fallback
    }
  };

  return {
    remainingMs: () => Math.max(0, read() + cooldownMs - Date.now()),
    markSubmitted() {
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem(key, String(Date.now()));
        }
      } catch {
        /* ignore */
      }
    },
  };
}

