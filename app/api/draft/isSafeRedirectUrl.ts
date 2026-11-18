/**
 * Guards the draft routes' ?redirect= against open redirects: the target must
 * resolve to this site's hostname, which also rejects //evil.com and /\evil.com
 */
export function isSafeRedirectUrl(candidate: string, requestUrl: URL): boolean {
  try {
    const target = new URL(candidate, requestUrl);
    return target.hostname === requestUrl.hostname;
  } catch {
    return false;
  }
}
