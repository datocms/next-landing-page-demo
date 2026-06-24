/**
 * Determine whether a user-supplied redirect target is safe to follow — i.e. it
 * points to the same host as the current request.
 *
 * This guards against open-redirect attacks. A naive `url.startsWith('http')`
 * check — and even a plain "is it a relative URL?" check — fails to catch
 * protocol-relative targets like `//evil.com` or backslash variants like
 * `/\evil.com`, both of which browsers happily send off-site.
 *
 * Instead, we resolve the candidate against the current request URL and require
 * the resulting hostname to match. Relative paths (`/foo`, `/a?b=1#c`) resolve
 * to the same host and pass; anything that escapes to another host — or fails to
 * parse — is rejected. The scheme is irrelevant: we only compare hostnames.
 */
export default function isSafeRedirectUrl(
  candidate: string,
  requestUrl: URL,
): boolean {
  try {
    const target = new URL(candidate, requestUrl);
    return target.hostname === requestUrl.hostname;
  } catch {
    return false;
  }
}
