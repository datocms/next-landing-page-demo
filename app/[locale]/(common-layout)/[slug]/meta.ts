import { PostExcerptFragment } from '@/components/posts/PostExcerpt/fragment';
import { AboutIntroFragment } from '@/components/sections/AboutIntro/fragment';
import { BrandSectionFragment } from '@/components/sections/BrandSection/fragment';
import { ChangelogSectionFragment } from '@/components/sections/ChangelogSection/fragment';
import { DetailSectionFragment } from '@/components/sections/DetailSection/fragment';
import { FaqSectionFragment } from '@/components/sections/FaqSection/fragment';
import { FeaturedPostsSectionFragment } from '@/components/sections/FeaturedPostsSection/fragment';
import { FeatureListSectionFragment } from '@/components/sections/FeatureListSection/fragment';
import { HeroSectionFragment } from '@/components/sections/HeroSection/fragment';
import { PricingSectionFragment } from '@/components/sections/PricingSection/fragment';
import { ReviewSectionFragment } from '@/components/sections/ReviewSection/fragment';
import { StatsSectionFragment } from '@/components/sections/StatsSection/fragment';
import { TeamSectionFragment } from '@/components/sections/TeamSection/fragment';
import { VideoSectionFragment } from '@/components/sections/VideoSection/fragment';
import { TagFragment } from '@/lib/datocms/commonFragments';
import {
  graphql,
  type ResultOf,
  type VariablesOf,
} from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = ResolvedGlobalPageProps & {
  params: {
    slug: string;
  };
};

export const query = graphql(
  /* GraphQL */ `
    query PageQuery(
      $locale: SiteLocale
      $fallbackLocale: [SiteLocale!]
      $slug: String
      $postsPerPage: IntType
    ) {
      page(
        filter: { slug: { eq: $slug } }
        locale: $locale
        fallbackLocales: $fallbackLocale
      ) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        sections {
          ... on RecordInterface {
            id
            __typename
          }
          ...AboutIntroFragment
          ...ChangelogSectionFragment
          ...StatsSectionFragment
          ...TeamSectionFragment
          ...FaqSectionFragment
          ...HeroSectionFragment
          ...VideoSectionFragment
          ...DetailSectionFragment
          ...ReviewSectionFragment
          ...PricingSectionFragment
          ...BrandSectionFragment
          ...FeaturedPostsSectionFragment
          ...FeatureListSectionFragment
          ... on RedirectSectionRecord {
            slugToRedirectTo
          }
        }
        id
        label
        __typename
      }
      allPosts(
        filter: { title: { isBlank: "false" } }
        orderBy: _createdAt_DESC
        first: $postsPerPage
        locale: $locale
        fallbackLocales: $fallbackLocale
      ) {
        id
        ...PostExcerptFragment
      }
      _allPostsMeta(locale: $locale, filter: { title: { isBlank: "false" } }) {
        count
      }
    }
  `,
  [
    TagFragment,
    AboutIntroFragment,
    ChangelogSectionFragment,
    StatsSectionFragment,
    TeamSectionFragment,
    FaqSectionFragment,
    HeroSectionFragment,
    VideoSectionFragment,
    DetailSectionFragment,
    ReviewSectionFragment,
    PricingSectionFragment,
    BrandSectionFragment,
    FeaturedPostsSectionFragment,
    FeatureListSectionFragment,
    PostExcerptFragment,
  ],
);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
