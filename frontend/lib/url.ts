/**
 * URL safety helpers.
 *
 * Affiliate/store destinations come from the data layer and must never be
 * trusted blindly. Every outbound link in the UI goes through `safeRedirect`.
 */
const HTTP_PROTOCOLS = new Set(["http:", "https:"]);

export function isSafeHttpUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0 || value.length > 2048) return false;
  try {
    const url = new URL(value);
    return HTTP_PROTOCOLS.has(url.protocol);
  } catch {
    return false;
  }
}

/**
 * Returns a validated http(s) URL or `undefined`.
 * `javascript:`, `data:`, protocol-relative and malformed values are rejected.
 */
export function safeRedirect(value: unknown): string | undefined {
  return isSafeHttpUrl(value) ? value : undefined;
}

/** Prefix that marks an external destination for `rel="noopener noreferrer"`. */
export function isExternalUrl(value: string, ownOrigin: string): boolean {
  return !value.startsWith(`${ownOrigin}/`) && value !== ownOrigin;
}
