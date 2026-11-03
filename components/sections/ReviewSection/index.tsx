import { stripStega } from '@datocms/content-link';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { ReviewSectionFragment } from './fragment';
import HighlighterCards from './variants/HighlighterCards';
import MinimalCarousel from './variants/MinimalCarousel';
import MinimalReviewCards from './variants/MinimalReviewCards';
import SpotlightCarousel from './variants/SpotlightCarousel';
import WindowCarousel from './variants/WindowCarousel';

type Props = {
  fragment: FragmentOf<typeof ReviewSectionFragment>;
  locale: string;
  /** h1 when the section opens a page without a hero */
  as?: 'h1' | 'h2';
};

/**
 * Renders the layout picked in the block's "Display options" field. The
 * "carrousel" spelling comes from the CMS option values.
 */
const ReviewSection = ({ fragment, locale, as }: Props) => {
  const { displayOptions } = readFragment(ReviewSectionFragment, fragment);

  switch (stripStega(displayOptions ?? '')) {
    case 'card_carrousel':
      return <SpotlightCarousel fragment={fragment} locale={locale} as={as} />;
    case 'modern_carrousel':
      return <WindowCarousel fragment={fragment} locale={locale} as={as} />;
    case 'minimal_carrousel':
      return <MinimalCarousel fragment={fragment} locale={locale} as={as} />;
    case 'minimal_cards':
      return <MinimalReviewCards fragment={fragment} locale={locale} as={as} />;
    default:
      return <HighlighterCards fragment={fragment} locale={locale} as={as} />;
  }
};

export default ReviewSection;
