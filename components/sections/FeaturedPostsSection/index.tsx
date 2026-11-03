import { stripStega } from '@datocms/content-link';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { FeaturedPostsSectionFragment } from './fragment';
import BentoGrid from './variants/BentoGrid';
import CardGrid from './variants/CardGrid';
import IndexList from './variants/IndexList';
import PhotoCards from './variants/PhotoCards';
import SpotlightCarousel from './variants/SpotlightCarousel';

type Props = {
  fragment: FragmentOf<typeof FeaturedPostsSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** h1 when the section opens a page without a hero */
  as?: 'h1' | 'h2';
};

/**
 * Renders the layout picked in the block's "Display options" field. Both
 * "carrousel" (the CMS spelling) and "carousel" pick the carousel.
 */
const FeaturedPostsSection = ({ fragment, globalPageProps, as }: Props) => {
  const { displayOptions } = readFragment(
    FeaturedPostsSectionFragment,
    fragment,
  );
  const props = { fragment, globalPageProps, as };

  switch (stripStega(displayOptions ?? '')) {
    case 'modern_cards':
      return <BentoGrid {...props} />;
    case 'carrousel':
    case 'carousel':
      return <SpotlightCarousel {...props} />;
    case 'minimalist_grid':
      return <IndexList {...props} />;
    case 'full_image_card':
      return <PhotoCards {...props} />;
    default:
      return <CardGrid {...props} />;
  }
};

export default FeaturedPostsSection;
