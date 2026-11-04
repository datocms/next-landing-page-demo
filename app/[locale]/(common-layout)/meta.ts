import { FooterFragment } from '@/components/layout/Footer/fragment';
import { HeaderFragment } from '@/components/layout/Header/fragment';
import {
  graphql,
  type ResultOf,
  type VariablesOf,
} from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = ResolvedGlobalPageProps & {
  children: React.ReactNode;
};

export const query = graphql(
  /* GraphQL */ `
    query CommonLayoutQuery($locale: SiteLocale, $fallbackLocales: [SiteLocale!]) {
      layout(locale: $locale, fallbackLocales: $fallbackLocales) {
        ...HeaderFragment
        ...FooterFragment
      }
      _site {
        locales
      }
    }
  `,
  [HeaderFragment, FooterFragment],
);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
