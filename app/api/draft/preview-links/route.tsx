import { type GlobalPageProps, buildUrl } from '@/utils/globalPageProps';
import type { SchemaTypes } from '@datocms/cma-client-node';
import type { NextRequest } from 'next/server';

const websiteBaseUrl = (
  process.env.VERCEL_BRANCH_URL
    ? // Vercel auto-populates this environment variable
      `https://${process.env.VERCEL_BRANCH_URL}`
    : // Netlify auto-populates this environment variable
      process.env.URL
) as string;

// This function knows how to convert a DatoCMS record
// into a canonical URL within the website
const generatePreviewUrl = (
  item: SchemaTypes.Item,
  itemType: SchemaTypes.ItemType,
  globalPageProps: GlobalPageProps,
) => {
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
    case 'header':
      return buildUrl(globalPageProps, '/home');
    case 'documentation_home':
      return buildUrl(globalPageProps, '/docs');
    case 'documentation_page':
      return buildUrl(globalPageProps, `/docs/${item.attributes.slug}`);
    case 'layout':
      return buildUrl(globalPageProps, '/home');
    case 'footer':
      return buildUrl(globalPageProps, '/home');
    case 'pricing_tier':
      return buildUrl(globalPageProps, '/pricing');
    case 'change_log':
      return buildUrl(globalPageProps, '/changelog');
  }
};

const responseDefaults: ResponseInit = {
  status: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  },
};

// Setup CORS permissions
export async function OPTIONS(request: NextRequest) {
  return new Response('OK', responseDefaults);
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const token = searchParams.get('token');

  if (token !== process.env.DRAFT_SECRET_TOKEN)
    return new Response('Invalid token', { ...responseDefaults, status: 401 });

  // The Web Previews plugin sends the record and model for which the user wants a preview,
  // along with information about which locale they are currently viewing in the interface
  const { item, itemType, locale } = await request.json();

  // We can use this info to generate the frontend URL associated
  const url = generatePreviewUrl(item, itemType, { params: { locale } });

  // If we don't have an URL for the record, simply return an empty array
  if (!url) {
    return Response.json({ previewLinks: [] }, responseDefaults);
  }

  const previewLinks = [];

  // If status is not draft, it means that it has a published version!
  if (item.meta.status !== 'draft')
    // Generate a URL that first exits from Next.js Draft Mode, and then redirects to the desired URL.
    previewLinks.push({
      label: 'Published version',
      url: `${websiteBaseUrl}/api/draft/disable?url=${url}`,
    });

  // If status is not published, it means that it has a current version that's different from the published one!
  if (item.meta.status !== 'published')
    // Generate a URL that initially enters Next.js Draft Mode, and then redirects to the desired URL
    previewLinks.push({
      label: 'Draft version',
      url: `${websiteBaseUrl}/api/draft/enable?url=${url}&token=${token}`,
    });

  return Response.json({ previewLinks }, responseDefaults);
}
