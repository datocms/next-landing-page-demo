import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { isSafeRedirectUrl } from '../isSafeRedirectUrl';
import { partitionDraftModeCookie } from '../partitionDraftModeCookie';

/**
 * Turns Draft Mode off, then redirects to `?redirect=` when there is one (a
 * path on this site). Called by the "Published version" links from
 * /api/draft/preview-links and by the site's Draft Mode toggle.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;

  const redirectPath = searchParams.get('redirect');

  if (redirectPath && !isSafeRedirectUrl(redirectPath, requestUrl))
    return new Response('URL must be relative!', { status: 422 });

  (await draftMode()).disable();

  await partitionDraftModeCookie();

  if (!redirectPath) return new Response('Draft mode is disabled');

  redirect(redirectPath);
}
