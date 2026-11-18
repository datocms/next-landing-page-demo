import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import {
  graphql,
  type ResultOf,
  type VariablesOf,
} from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = ResolvedGlobalPageProps;

export const query = graphql(
  /* GraphQL */ `
    query AuthorsQuery($locale: SiteLocale, $fallbackLocales: [SiteLocale!]) {
      allAuthors(
        orderBy: name_ASC
        first: 100
        locale: $locale
        fallbackLocales: $fallbackLocales
      ) {
        id
        name
        slug
        role
        description {
          value
        }
        areasOfInterest {
          id
          label
        }
        picture {
          focalPoint {
            x
            y
          }
          responsiveImage(
            imgixParams: {
              w: "240"
              h: "240"
              fit: crop
              crop: focalpoint
              # The avatars are drawn as busts: small crops zoom in on the head
              fpZ: 1.5
              auto: format
            }
          ) {
            ...ResponsiveImageFragment
          }
        }
        _allReferencingPostsMeta(
          locale: $locale
          filter: { title: { isBlank: "false" } }
        ) {
          count
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
