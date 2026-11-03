import { buildClient, type SimpleSchemaTypes } from '@datocms/cma-client-node';
import got from 'got';
import { parseHTML } from 'linkedom';
import { cookies, draftMode } from 'next/headers';
import type { NextRequest } from 'next/server';
import type { SiteLocale } from '@/lib/datocms/graphql';
import {
  buildUrl,
  type ResolvedGlobalPageProps,
} from '@/utils/globalPageProps';

/*
 * The SEO/Readability Analysis plugin calls this endpoint (configured by
 * /api/post-install) while an editor works on a record: it finds the record's
 * page, renders it with the draft content, and returns the page's HTML, title
 * and description for the plugin to analyze.
 */

const websiteBaseUrl = (
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? // Vercel auto-populates this environment variable
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : // Netlify auto-populates this environment variable
      process.env.URL
) as string;

const headers = {
  'Content-Type': 'text/html',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
};

/** The record's slug and its path on the website, for the models that have a page */
function findSlugAndPermalink(
  item: SimpleSchemaTypes.Item,
  itemTypeApiKey: string,
  globalPageProps: ResolvedGlobalPageProps,
): [string, string] | [null, null] {
  const slug = item.slug as string;

  switch (itemTypeApiKey) {
    case 'page':
      // The home record's permalink is the locale root
      return [
        slug,
        buildUrl(globalPageProps, slug === 'home' ? '/' : `/${slug}`),
      ];
    case 'post':
      return [slug, buildUrl(globalPageProps, `/posts/${slug}`)];
    default:
      return [null, null];
  }
}

// CORS preflight: the plugin calls from the DatoCMS dashboard, another origin
export async function OPTIONS() {
  return new Response('ok', {
    status: 200,
    headers,
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const itemId = searchParams.get('itemId');
  const itemTypeId = searchParams.get('itemTypeId');
  const itemTypeApiKey = searchParams.get('itemTypeApiKey');
  const locale = searchParams.get('locale');
  const sandboxEnvironmentId = searchParams.get('sandboxEnvironmentId');

  // The token is sent by the plugin as a request header (see /api/post-install)
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '');

  if (!token || token !== process.env.SEO_SECRET_TOKEN)
    return new Response('Invalid token', { status: 401, headers });

  try {
    if (
      !itemId ||
      !itemTypeApiKey ||
      !itemTypeId ||
      !locale ||
      !sandboxEnvironmentId
    ) {
      return new Response('Missing required parameters!', {
        status: 422,
        headers,
      });
    }

    // Read the record from the environment the editor is working in
    const client = buildClient({
      apiToken: process.env.DATOCMS_CMA_TOKEN || '',
      environment: sandboxEnvironmentId,
    });

    const item = await client.items.find(itemId);

    const [slug, permalink] = findSlugAndPermalink(item, itemTypeApiKey, {
      params: { locale: locale as SiteLocale },
    });

    if (!permalink) {
      return new Response(
        `Don't know which route corresponds to record #${itemId} (model: ${itemTypeApiKey})!`,
        {
          status: 422,
          headers,
        },
      );
    }

    // Fetch the page in Draft Mode, so the analysis sees unpublished changes:
    // enable it to get its cookie, send that cookie along, then disable it
    const draft = await draftMode();
    draft.enable();

    const cookieStore = await cookies();
    const { body } = await got(new URL(permalink, websiteBaseUrl).toString(), {
      headers: {
        cookie: cookieStore.toString(),
      },
    });

    draft.disable();

    const { document } = parseHTML(body);
    const contentEl = document.querySelector('body');
    if (!contentEl)
      return new Response('No content found', { status: 422, headers });
    const pageContent = contentEl.innerHTML;
    const pageLocale =
      document.querySelector('html')?.getAttribute('lang') || 'en';
    const pageTitle = document.querySelector('title')?.textContent;
    const pageDescription = document
      .querySelector('meta[name="description"]')
      ?.getAttribute('content');

    return new Response(
      JSON.stringify({
        locale: pageLocale,
        slug,
        permalink,
        title: pageTitle,
        description: pageDescription,
        content: pageContent,
      }),
      { status: 200, headers },
    );
  } catch (error) {
    // Never return the error: the DatoCMS client stores the failed request in
    // it, Authorization header and payload included
    console.error(error);

    return new Response('Internal server error', { status: 500, headers });
  }
}
