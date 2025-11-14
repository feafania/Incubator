/**
 * Safely extracts cookies from Supertest response headers.
 */
export function extractCookies(
  setCookieHeader: string | string[] | undefined,
): string[] {
  if (!setCookieHeader) return [];

  return Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
}

/**
 * Finds specific cookie by name (prefix match).
 */
export function findCookie(
  setCookieHeader: string | string[] | undefined,
  cookieName: string,
): string | undefined {
  const cookies = extractCookies(setCookieHeader);

  return cookies.find((c) => c.startsWith(cookieName + "="));
}
