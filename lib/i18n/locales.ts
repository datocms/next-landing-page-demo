import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';

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

/** The project's first locale: used when a field has no value in the requested one */
export async function getFallbackLocale() {
  const locales = await getAvailableLocales();
  return locales[0];
}
