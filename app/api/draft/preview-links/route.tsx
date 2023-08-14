import { NextRequest } from 'next/server';
import { headers as getHeaders } from 'next/headers';
import { SiteLocale } from '@/graphql/generated';

type generatePreviewUrlParams = {
  item: any;
  itemType: any;
  locale: SiteLocale;
};

const generatePreviewUrl = ({
  item,
  itemType,
  locale,
}: generatePreviewUrlParams) => {
  switch (itemType.attributes.api_key) {
    case 'page':
      if (item.attributes.slug === 'home') return `/${locale}/`; //special case for default home page
      return `/${locale}/${item.attributes.slug}`;
    case 'post':
      return `/${locale}/posts/${item.attributes.slug}`;
    case 'tag':
      return `/${locale}/posts/tag/${item.attributes.slug}`;
    case 'author':
      return `/${locale}/posts/author/${item.attributes.slug}`;
    case 'legal_page':
      return `/${locale}/legal/${item.attributes.slug}`;
    case 'type_name':
      return `/${locale}/type_name/${item.attributes.slug}`;
    default:
      return '/en/404';
  }
};

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export async function OPTIONS(request: NextRequest) {
  return new Response('ok', {
    status: 200,
    headers,
  });
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const token = searchParams.get('token');

  if (token !== process.env.DRAFT_SECRET_TOKEN)
    return new Response('Invalid token', { status: 401 });

  const parsedRequest = await request.json();
  const url = generatePreviewUrl(parsedRequest);

  if (!url) {
    return new Response(JSON.stringify({ previewLinks: [] }), {
      status: 200,
      headers,
    });
  }

  // const baseUrl = process.env.VERCEL_URL
  //   ? `https://${process.env.VERCEL_URL}`
  //   : process.env.URL;

  const baseUrl = process.env.URL;

  const previewLinks = [
    {
      label: 'Published version',
      url: `${baseUrl}${url}`,
    },
    {
      label: 'Draft version',
      url: `${baseUrl}api/draft/enable?url=${url}&token=${token}`,
    },
  ];

  return new Response(JSON.stringify({ previewLinks }), {
    status: 200,
    headers,
  });
}
