import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import isSafeRedirectUrl from '@/utils/isSafeRedirectUrl';
import partitionDraftModeCookie from '../partitionDraftModeCookie';

/**
 * Turns Draft Mode off, then redirects to `?redirect=` when there is one (a
 * path on this site). Called by the "Published version" links from
 * /api/draft/preview-links and by the site's Draft Mode toggle.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;

  const redirectPath = searchParams.get('redirect');

  const draft = await draftMode();
  draft.disable();

  if (!redirectPath) return new Response('Draft mode is disabled');

  if (!isSafeRedirectUrl(redirectPath, requestUrl))
    return new Response('URL must be relative!', { status: 422 });

  await partitionDraftModeCookie();

  redirect(redirectPath);
}
