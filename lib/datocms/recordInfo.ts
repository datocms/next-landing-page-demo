import {
  authorUrl,
  changelogUrl,
  docsHomeUrl,
  docsPageUrl,
  legalPageUrl,
  pageUrl,
  postUrl,
  tagUrl,
} from '@/utils/routes';
import type { SiteLocale } from './graphql';

/**
 * The website path that shows a record, for the Web Previews and
 * SEO/Readability Analysis plugins: its own page or, for the Layout and the
 * pricing tiers, a page they appear on (null for a model no page shows)
 */
export function recordToWebsiteRoute(
  itemTypeApiKey: string,
  slug: string,
  locale: SiteLocale,
): string | null {
  const globalPageProps = { params: { locale } };

  switch (itemTypeApiKey) {
    case 'page':
      return pageUrl(globalPageProps, slug);
    case 'post':
      return postUrl(globalPageProps, slug);
    case 'tag':
      return tagUrl(globalPageProps, slug);
    case 'author':
      return authorUrl(globalPageProps, slug);
    case 'legal_page':
      return legalPageUrl(globalPageProps, slug);
    case 'documentation_home':
      return docsHomeUrl(globalPageProps);
    case 'documentation_page':
      return docsPageUrl(globalPageProps, slug);
    // The Layout record (header, footer, menu) shows on every page, so preview it on the home page
    case 'layout':
      return pageUrl(globalPageProps, 'home');
    case 'pricing_tier':
      return pageUrl(globalPageProps, 'pricing');
    case 'change_log':
      return changelogUrl(globalPageProps, slug);
    default:
      return null;
  }
}
