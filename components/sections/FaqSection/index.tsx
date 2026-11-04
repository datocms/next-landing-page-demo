import { stripStega } from '@datocms/content-link';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { SectionHeadingLevel } from '@/utils/headingLevel';
import { FaqSectionFragment } from './fragment';
import FaqAccordion from './variants/FaqAccordion';
import FaqTileGrid from './variants/FaqTileGrid';

type Props = {
  fragment: FragmentOf<typeof FaqSectionFragment>;
  as?: SectionHeadingLevel;
};

/** Renders the layout picked in the block's "Display options" field, or nothing without questions */
const FaqSection = ({ fragment, as }: Props) => {
  const { displayOptions, questions } = readFragment(
    FaqSectionFragment,
    fragment,
  );
  if (questions.length === 0) return null;

  switch (stripStega(displayOptions)) {
    case 'accordion':
      return <FaqAccordion fragment={fragment} as={as} />;
    default:
      return <FaqTileGrid fragment={fragment} as={as} />;
  }
};

export default FaqSection;
