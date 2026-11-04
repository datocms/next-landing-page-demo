import { cookies } from 'next/headers';

// Next.js keeps Draft Mode on while this cookie holds the build's preview id
const DRAFT_MODE_COOKIE = '__prerender_bypass';

/**
 * Rewrites the cookie that draftMode().enable()/.disable() just set as
 * Secure, SameSite=None and Partitioned. Both draft routes call it whenever
 * they switch Draft Mode, so the toggle's fetch and the preview links set and
 * clear the same cookie.
 *
 * These routes also open inside the iframe of the Web Previews plugin, where
 * the site is a third party: browsers that block third-party cookies drop the
 * cookie as Next.js writes it, but keep a partitioned one
 * (https://developers.google.com/privacy-sandbox/3pcd).
 */
export async function partitionDraftModeCookie() {
  const cookieStore = await cookies();
  // draftMode() has just written it, so it is always there
  const { value } = cookieStore.get(DRAFT_MODE_COOKIE)!;

  cookieStore.set({
    name: DRAFT_MODE_COOKIE,
    value,
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'none',
    partitioned: true,
    // disable() empties the cookie: expire it too, as Next.js does
    ...(value ? {} : { expires: new Date(0) }),
  });
}
