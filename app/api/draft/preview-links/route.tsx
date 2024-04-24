import type { NextRequest } from 'next/server';
import type { SiteLocale } from '@/graphql/types/graphql';
import type { SchemaTypes } from '@datocms/cma-client-node';

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
  locale: SiteLocale
) => {
  switch (itemType.attributes.api_key) {
    case 'page':
      return `/${locale}/${item.attributes.slug}`;
    case 'post':
      return `/${locale}/posts/${item.attributes.slug}`;
    case 'tag':
      return `/${locale}/posts/tag/${item.attributes.slug}`;
    case 'author':
      return `/${locale}/posts/author/${item.attributes.slug}`;
    case 'legal_page':
      return `/${locale}/legal/${item.attributes.slug}`;
    case 'header':
      return `/${locale}/home`;
    case 'documentation_home':
      return `/${locale}/docs`;
    case 'documentation_page':
      return `/${locale}/docs/${item.attributes.slug}`;
    case 'layout':
      return `/${locale}/home`;
    case 'footer':
      return `/${locale}/home`;
    case 'pricing_tier':
      return `/${locale}/pricing`;
    case 'change_log':
      return `/${locale}/changelog`;
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
  const url = generatePreviewUrl(item, itemType, locale);

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
