import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { isSafeRedirectUrl } from '../isSafeRedirectUrl';
import { partitionDraftModeCookie } from '../partitionDraftModeCookie';

/**
 * Turns Draft Mode on, then redirects to `?redirect=` when there is one (a path
 * on this site). The draft secret comes as `?token=`: most callers are links a
 * browser opens, which can't carry a header (the "Draft version" links from
 * /api/draft/preview-links, the Web Previews plugin's Visual Editing mode), and
 * the site's Draft Mode password prompt sends it the same way.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;

  const token = searchParams.get('token');
  const redirectPath = searchParams.get('redirect');

  if (token !== process.env.DRAFT_SECRET_TOKEN)
    return new Response('Invalid token', { status: 401 });

  if (redirectPath && !isSafeRedirectUrl(redirectPath, requestUrl))
    return new Response('URL must be relative!', { status: 422 });

  (await draftMode()).enable();

  await partitionDraftModeCookie();

  if (!redirectPath) return new Response('Draft mode is enabled');

  redirect(redirectPath);
}
