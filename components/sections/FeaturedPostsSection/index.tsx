import { stripStega } from '@datocms/content-link';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import type { SectionHeadingLevel } from '@/utils/headingLevel';
import { FeaturedPostsSectionFragment } from './fragment';
import BentoGridPosts from './variants/BentoGridPosts';
import CardGridPosts from './variants/CardGridPosts';
import IndexListPosts from './variants/IndexListPosts';
import PhotoCardPosts from './variants/PhotoCardPosts';
import SpotlightPosts from './variants/SpotlightPosts';

type Props = {
  fragment: FragmentOf<typeof FeaturedPostsSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  as?: SectionHeadingLevel;
};

/**
 * Renders the layout picked in the block's "Display options" field, or
 * nothing without posts. Both "carrousel" (the CMS spelling) and "carousel"
 * pick the carousel.
 */
const FeaturedPostsSection = ({ fragment, globalPageProps, as }: Props) => {
  const { displayOptions, featuredPosts } = readFragment(
    FeaturedPostsSectionFragment,
    fragment,
  );
  if (featuredPosts.length === 0) return null;

  const props = { fragment, globalPageProps, as };

  switch (stripStega(displayOptions)) {
    case 'modern_cards':
      return <BentoGridPosts {...props} />;
    case 'carrousel':
    case 'carousel':
      return <SpotlightPosts {...props} />;
    case 'minimalist_grid':
      return <IndexListPosts {...props} />;
    case 'full_image_card':
      return <PhotoCardPosts {...props} />;
    default:
      return <CardGridPosts {...props} />;
  }
};

export default FeaturedPostsSection;
