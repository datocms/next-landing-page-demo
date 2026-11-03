import { cookies } from 'next/headers';

// Next.js keeps Draft Mode on while this cookie holds the build's preview id
const DRAFT_MODE_COOKIE = '__prerender_bypass';

/**
 * Sets the Draft Mode cookie that draftMode().enable() or .disable() has just
 * written again, as a partitioned, SameSite=None cookie, before a redirect.
 *
 * These routes also open inside the iframe of the Web Previews plugin, where
 * the site is a third party: browsers that block third-party cookies drop the
 * cookie as Next.js writes it, but keep a partitioned one
 * (https://developers.google.com/privacy-sandbox/3pcd).
 */
export default async function partitionDraftModeCookie() {
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
  });
}
