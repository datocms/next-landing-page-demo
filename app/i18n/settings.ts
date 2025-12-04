import { LocalesDocument } from '@/graphql/types/graphql';
import queryDatoCMS from '@/utils/queryDatoCMS';

export default async function getAvailableLocales(apiToken: string) {
  const { _site } = await queryDatoCMS(apiToken, LocalesDocument);
  return _site.locales;
}

export async function getFallbackLocale(apiToken: string) {
  const locales = await getAvailableLocales(apiToken);
  return locales[0]; //using the first ordered locale as fallback
}

export const primaryColor = 'rgb(var(--color-primary))';
