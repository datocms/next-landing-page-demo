import { notFound } from 'next/navigation';
import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql, type SiteLocale } from '@/lib/datocms/graphql';

const query = graphql(/* GraphQL */ `
  query LocalesQuery {
    _site {
      locales
    }
  }
`);

/** The locales enabled in the DatoCMS project, in the order set in its settings */
export async function getAvailableLocales() {
  const { _site } = await executeQuery(query);
  return _site.locales;
}

/** The URL's locale, typed: any locale the project doesn't have is a 404 */
export async function requireSiteLocale(locale: string): Promise<SiteLocale> {
  const locales: string[] = await getAvailableLocales();
  if (!locales.includes(locale)) notFound();
  return locale as SiteLocale;
}

/** The project's first locale: used when a field has no value in the requested one */
export async function getFallbackLocale() {
  const locales = await getAvailableLocales();
  return locales[0];
}
