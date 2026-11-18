import { stripStega } from '@datocms/content-link';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { FaqSectionFragment } from './fragment';
import FaqAccordion from './variants/FaqAccordion';
import FaqColumns from './variants/FaqColumns';
import FaqTabs from './variants/FaqTabs';

type Props = {
  fragment: FragmentOf<typeof FaqSectionFragment>;
};

/**
 * Renders the layout picked in the block's "Layout" field
 * (`columns`, also for unknown values, `accordion` or `tabs`), or nothing without questions
 */
const FaqSection = ({ fragment }: Props) => {
  const { layout, questions } = readFragment(FaqSectionFragment, fragment);
  if (questions.length === 0) return null;

  const value = stripStega(layout ?? '').trim();
  if (value === 'accordion') return <FaqAccordion fragment={fragment} />;
  if (value === 'tabs') return <FaqTabs fragment={fragment} />;
  return <FaqColumns fragment={fragment} />;
};

export default FaqSection;
