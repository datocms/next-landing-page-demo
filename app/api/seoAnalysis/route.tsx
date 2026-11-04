import { buildClient } from '@datocms/cma-client-node';
import { parseHTML } from 'linkedom';
import { cookies, draftMode } from 'next/headers';
import type { NextRequest } from 'next/server';
import { hasBearerToken, withCORS } from '@/app/api/utils';
import type { SiteLocale } from '@/lib/datocms/graphql';
import { recordToWebsiteRoute } from '@/lib/datocms/recordInfo';

/*
 * The SEO/Readability Analysis plugin calls this endpoint (configured by
 * /api/post-install) while an editor works on a record: it finds the record's
 * page, renders it with the draft content, and returns the page's HTML, title
 * and description for the plugin to analyze.
 */

export async function OPTIONS() {
  return new Response('OK', withCORS());
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const itemId = searchParams.get('itemId');
  const itemTypeId = searchParams.get('itemTypeId');
  const itemTypeApiKey = searchParams.get('itemTypeApiKey');
  const locale = searchParams.get('locale');
  const sandboxEnvironmentId = searchParams.get('sandboxEnvironmentId');

  if (!hasBearerToken(request, process.env.SEO_SECRET_TOKEN))
    return new Response('Invalid token', withCORS({ status: 401 }));

  try {
    if (
      !itemId ||
      !itemTypeApiKey ||
      !itemTypeId ||
      !locale ||
      !sandboxEnvironmentId
    ) {
      return new Response(
        'Missing required parameters!',
        withCORS({ status: 422 }),
      );
    }

    // Read the record from the environment the editor is working in
    const client = buildClient({
      apiToken: process.env.DATOCMS_CMA_TOKEN || '',
      environment: sandboxEnvironmentId,
    });

    const item = await client.items.find(itemId);
    const slug = item.slug as string;
    const permalink = recordToWebsiteRoute(
      itemTypeApiKey,
      slug,
      locale as SiteLocale,
    );

    if (!permalink) {
      return new Response(
        `Don't know which route corresponds to record #${itemId} (model: ${itemTypeApiKey})!`,
        withCORS({ status: 422 }),
      );
    }

    // Fetch the page in Draft Mode, so the analysis sees unpublished changes:
    // enable it to get its cookie, send that cookie along, then disable it.
    // The cookie only works on this deployment, so the page comes from it too
    const draft = await draftMode();
    draft.enable();

    const cookieStore = await cookies();
    const pageResponse = await fetch(new URL(permalink, request.url), {
      headers: { cookie: cookieStore.toString() },
    });

    draft.disable();

    if (!pageResponse.ok) {
      console.error(`${permalink} answered ${pageResponse.status}`);
      return new Response('Internal server error', withCORS({ status: 500 }));
    }

    const { document } = parseHTML(await pageResponse.text());
    const contentEl = document.querySelector('body');
    if (!contentEl)
      return new Response('No content found', withCORS({ status: 422 }));
    const pageContent = contentEl.innerHTML;
    const pageLocale =
      document.querySelector('html')?.getAttribute('lang') || 'en';
    const pageTitle = document.querySelector('title')?.textContent;
    const pageDescription = document
      .querySelector('meta[name="description"]')
      ?.getAttribute('content');

    return Response.json(
      {
        locale: pageLocale,
        slug,
        permalink,
        title: pageTitle,
        description: pageDescription,
        content: pageContent,
      },
      withCORS(),
    );
  } catch (error) {
    // Never return the error: the DatoCMS client stores the failed request in
    // it, Authorization header and payload included
    console.error(error);

    return new Response('Internal server error', withCORS({ status: 500 }));
  }
}
