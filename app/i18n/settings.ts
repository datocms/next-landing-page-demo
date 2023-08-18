import { LocalesDocument, SiteLocale } from '@/graphql/generated';
import queryDatoCMS from '@/utils/queryDatoCMS';

export const fallbackLng = 'en' as SiteLocale;

export default async function getAvailableLocales() {
  const { _site } = await queryDatoCMS(LocalesDocument);

  return _site.locales;
}
