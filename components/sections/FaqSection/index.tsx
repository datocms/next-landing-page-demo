import { stripStega } from '@datocms/content-link';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { FaqSectionFragment } from './fragment';
import Accordion from './variants/Accordion';
import TileGrid from './variants/TileGrid';

type Props = {
  fragment: FragmentOf<typeof FaqSectionFragment>;
  /** h1 when the section opens a page without a hero */
  as?: 'h1' | 'h2';
};

/** Renders the layout picked in the block's "Display options" field */
const FaqSection = ({ fragment, as }: Props) => {
  const { displayOptions } = readFragment(FaqSectionFragment, fragment);

  return stripStega(displayOptions ?? '') === 'accordion' ? (
    <Accordion fragment={fragment} as={as} />
  ) : (
    <TileGrid fragment={fragment} as={as} />
  );
};

export default FaqSection;
