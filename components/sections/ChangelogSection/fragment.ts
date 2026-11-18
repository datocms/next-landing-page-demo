import { graphql } from '@/lib/datocms/graphql';

export const ChangelogSectionFragment = graphql(/* GraphQL */ `
  fragment ChangelogSectionFragment on ChangelogSectionBlockRecord {
    featuredVersions {
      timeOfRelease
      versionName
      slug
      id
      content {
        value
      }
    }
  }
`);
