import type { SchemaTypes } from '@datocms/cma-client-node';
import type { NextRequest } from 'next/server';
import {
  buildUrl,
  type ResolvedGlobalPageProps,
} from '@/utils/globalPageProps';

/*
 * The Web Previews plugin calls this endpoint (configured by /api/post-install)
 * whenever an editor opens a record in DatoCMS, and shows the links it returns
 * in the record's sidebar.
 */

const websiteBaseUrl = (
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? // Vercel auto-populates this environment variable
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : // Netlify auto-populates this environment variable
      process.env.URL
) as string;

const responseDefaults: ResponseInit = {
  status: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  },
};

/** The path on the website where a record shows up (undefined for a model without one) */
function recordPath(
  item: SchemaTypes.Item,
  itemType: SchemaTypes.ItemType,
  globalPageProps: ResolvedGlobalPageProps,
) {
  switch (itemType.attributes.api_key) {
    case 'page':
      return buildUrl(globalPageProps, `/${item.attributes.slug}`);
    case 'post':
      return buildUrl(globalPageProps, `/posts/${item.attributes.slug}`);
    case 'tag':
      return buildUrl(globalPageProps, `/posts/tag/${item.attributes.slug}`);
    case 'author':
      return buildUrl(globalPageProps, `/posts/author/${item.attributes.slug}`);
    case 'legal_page':
      return buildUrl(globalPageProps, `/legal/${item.attributes.slug}`);
    case 'documentation_home':
      return buildUrl(globalPageProps, '/docs');
    case 'documentation_page':
      return buildUrl(globalPageProps, `/docs/${item.attributes.slug}`);
    // Records shown on every page preview on the home page
    case 'layout':
    case 'header':
    case 'footer':
      return buildUrl(globalPageProps, '/home');
    case 'pricing_tier':
      return buildUrl(globalPageProps, '/pricing');
    case 'change_log':
      return buildUrl(globalPageProps, `/changelog/${item.attributes.slug}`);
  }
}

// CORS preflight: the plugin calls from the DatoCMS dashboard, another origin
export async function OPTIONS() {
  return new Response('OK', responseDefaults);
}

export async function POST(request: NextRequest) {
  // The token is sent by the plugin as a request header (see /api/post-install)
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '');

  if (!token || token !== process.env.DRAFT_SECRET_TOKEN)
    return new Response('Invalid token', { ...responseDefaults, status: 401 });

  // The record and its model, and the locale the editor is viewing it in
  const { item, itemType, locale } = await request.json();

  const url = recordPath(item, itemType, { params: { locale } });

  if (!url) {
    return Response.json({ previewLinks: [] }, responseDefaults);
  }

  const previewLinks = [];

  // A record that isn't published (a draft, or published with newer changes)
  // has a draft version: the link turns Draft Mode on and redirects to the page.
  // A browser opens it, where we cannot set headers, so the token is in the URL
  if (item.meta.status !== 'published')
    previewLinks.push({
      label: 'Draft version',
      url: `${websiteBaseUrl}/api/draft/enable?token=${encodeURIComponent(token)}&redirect=${encodeURIComponent(url)}`,
    });

  // A record that isn't a draft has a published version: the link turns Draft
  // Mode off and redirects to the page
  if (item.meta.status !== 'draft')
    previewLinks.push({
      label: 'Published version',
      url: `${websiteBaseUrl}/api/draft/disable?redirect=${encodeURIComponent(url)}`,
    });

  return Response.json({ previewLinks }, responseDefaults);
}
