import {
  graphql,
  type ResultOf,
  type VariablesOf,
} from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = ResolvedGlobalPageProps & {
  children: React.ReactNode;
};

/*
 * The sidebar tree is handed to a client component, so everything selected
 * here ends up in every docs page's client payload: select only what the
 * sidebar renders (id, slug, title), four levels deep.
 */
export const query = graphql(/* GraphQL */ `
  query DocumentationSidebarQuery(
    $locale: SiteLocale
    $fallbackLocale: [SiteLocale!]
  ) {
    allDocumentationPages(
      filter: { parent: { exists: "false" } }
      locale: $locale
      fallbackLocales: $fallbackLocale
    ) {
      id
      slug
      title
      children {
        id
        slug
        title
        children {
          id
          slug
          title
          children {
            id
            slug
            title
            children {
              id
              slug
              title
            }
          }
        }
      }
    }
    documentationHome(locale: $locale, fallbackLocales: $fallbackLocale) {
      footerText
      logo {
        url
        width
        height
      }
    }
  }
`);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
