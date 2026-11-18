import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { FaqSectionFragment } from '@/components/sections/FaqSection/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import styles from '../FaqSection.module.css';
import FloatingMarks from '../FloatingMarks';
import SettleIn from '../SettleIn';
import AccordionList from './AccordionList';

type Props = {
  fragment: FragmentOf<typeof FaqSectionFragment>;
};

/**
 * `accordion`: the questions as a centred stack of pale tiles: the question in semibold
 * with a white plus circle. One question is open at a time (the first on
 * load): it turns white with a hairline ring and a faint lift, its circle
 * pale with a minus, the answer under it in muted text. Large pale question
 * marks drift behind the section.
 */
const FaqAccordion = ({ fragment }: Props) => {
  const { questions } = readFragment(FaqSectionFragment, fragment);

  return (
    <section className={cn(styles.root, 'section relative isolate')}>
      <FloatingMarks layout="accordion" />
      <SettleIn className="container-page">
        <div className="mx-auto max-w-[56rem]">
          <AccordionList
            items={questions.map((question) => ({
              id: question.id,
              question: question.question,
              answer: <DatoStructuredText data={question.answer} />,
            }))}
          />
        </div>
      </SettleIn>
    </section>
  );
};

export default FaqAccordion;
