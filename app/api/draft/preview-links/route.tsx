import type { RawApiTypes } from '@datocms/cma-client-node';
import type { NextRequest } from 'next/server';
import { hasBearerToken, withCORS } from '@/app/api/utils';
import type { SiteLocale } from '@/lib/datocms/graphql';
import { recordToWebsiteRoute } from '@/lib/datocms/recordInfo';
import { websiteBaseUrl } from '@/lib/websiteBaseUrl';

/*
 * The Web Previews plugin calls this endpoint (configured by /api/post-install)
 * whenever an editor opens a record in DatoCMS, and shows the links it returns
 * in the record's sidebar.
 */

type PreviewLinksRequest = {
  item: RawApiTypes.Item;
  itemType: RawApiTypes.ItemType;
  locale: SiteLocale;
};

export async function OPTIONS() {
  return new Response('OK', withCORS());
}

export async function POST(request: NextRequest) {
  if (!hasBearerToken(request, process.env.DRAFT_SECRET_TOKEN))
    return new Response('Invalid token', withCORS({ status: 401 }));

  const { item, itemType, locale }: PreviewLinksRequest = await request.json();

  const url = recordToWebsiteRoute(
    itemType.attributes.api_key,
    item.attributes.slug as string,
    locale,
  );

  if (!url) {
    return Response.json({ previewLinks: [] }, withCORS());
  }

  const previewLinks = [];

  // A record that isn't published (a draft, or published with newer changes)
  // has a draft version: the link turns Draft Mode on and redirects to the page.
  // A browser opens it and can't send headers, so the token is in the URL
  if (item.meta.status !== 'published')
    previewLinks.push({
      label: 'Draft version',
      url: `${websiteBaseUrl}/api/draft/enable?token=${encodeURIComponent(process.env.DRAFT_SECRET_TOKEN as string)}&redirect=${encodeURIComponent(url)}`,
    });

  // A record that isn't a draft has a published version: the link turns Draft
  // Mode off and redirects to the page
  if (item.meta.status !== 'draft')
    previewLinks.push({
      label: 'Published version',
      url: `${websiteBaseUrl}/api/draft/disable?redirect=${encodeURIComponent(url)}`,
    });

  return Response.json({ previewLinks }, withCORS());
}
