import { graphql } from '@/lib/datocms/graphql';

export const FooterFragment = graphql(/* GraphQL */ `
  fragment FooterFragment on LayoutRecord {
    footerSubtitle {
      value
    }
    footerLogo {
      url
      height
      width
    }
    socialMediaLinks {
      url
      name
      id
      icon {
        url
      }
    }
    footerLinks {
      id
      slug
      title
    }
  }
`);
