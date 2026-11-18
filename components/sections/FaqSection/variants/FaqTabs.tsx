import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { FaqSectionFragment } from '../fragment';
import SettleIn from '../SettleIn';
import AccordionList from './AccordionList';
import TabsList from './TabsList';

type Props = {
  fragment: FragmentOf<typeof FaqSectionFragment>;
};

/**
 * `tabs` (the mosaic page's look): from 1024px the questions are a column of
 * pale tiles on the left and the picked one's answer shows in a tinted tile
 * on the right, a navy quarter circle in its corner. Below, the same
 * questions are the accordion.
 */
const FaqTabs = ({ fragment }: Props) => {
  const { questions } = readFragment(FaqSectionFragment, fragment);
  const items = questions.map((question) => ({
    id: question.id,
    question: question.question,
    answer: <DatoStructuredText data={question.answer} />,
  }));

  return (
    <section className="section">
      <SettleIn className="container-page">
        <div className="max-lg:hidden">
          <TabsList items={items} />
        </div>
        <div className="lg:hidden">
          <AccordionList items={items} />
        </div>
      </SettleIn>
    </section>
  );
};

export default FaqTabs;
