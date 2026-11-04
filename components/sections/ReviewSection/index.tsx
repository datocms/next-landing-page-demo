import { stripStega } from '@datocms/content-link';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { SectionHeadingLevel } from '@/utils/headingLevel';
import { ReviewSectionFragment } from './fragment';
import HighlighterCards from './variants/HighlighterCards';
import MinimalCarousel from './variants/MinimalCarousel';
import MinimalReviewCards from './variants/MinimalReviewCards';
import SpotlightCarousel from './variants/SpotlightCarousel';
import WindowTabs from './variants/WindowTabs';

type Props = {
  fragment: FragmentOf<typeof ReviewSectionFragment>;
  locale: string;
  as?: SectionHeadingLevel;
};

/**
 * Renders the layout picked in the block's "Display options" field, or
 * nothing without reviews. The "carrousel" spelling comes from the CMS option
 * values.
 */
const ReviewSection = ({ fragment, locale, as }: Props) => {
  const { displayOptions, reviews } = readFragment(
    ReviewSectionFragment,
    fragment,
  );
  if (reviews.length === 0) return null;

  switch (stripStega(displayOptions)) {
    case 'card_carrousel':
      return <SpotlightCarousel fragment={fragment} locale={locale} as={as} />;
    case 'modern_carrousel':
      return <WindowTabs fragment={fragment} locale={locale} as={as} />;
    case 'minimal_carrousel':
      return <MinimalCarousel fragment={fragment} locale={locale} as={as} />;
    case 'minimal_cards':
      return <MinimalReviewCards fragment={fragment} locale={locale} as={as} />;
    default:
      return <HighlighterCards fragment={fragment} locale={locale} as={as} />;
  }
};

export default ReviewSection;
