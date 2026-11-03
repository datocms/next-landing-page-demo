import { graphql } from '@/lib/datocms/graphql';

export const ChangelogSectionFragment = graphql(/* GraphQL */ `
  fragment ChangelogSectionFragment on ChangelogSectionRecord {
    subtitle
    title
    featuredVersions {
      timeOfRelease
      versionName
      slug
      id
      __typename
    }
  }
`);
