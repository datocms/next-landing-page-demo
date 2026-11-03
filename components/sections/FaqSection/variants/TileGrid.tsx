import { useId } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { FaqSectionFragment } from '@/components/sections/FaqSection/fragment';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';

type Props = {
  fragment: FragmentOf<typeof FaqSectionFragment>;
  /** h1 when the section opens a page without a hero */
  as?: 'h1' | 'h2';
};

/**
 * Tile grid (the default): a centred head over an always-open grid of tinted
 * tiles, two to a row from 1024. Each tile carries a mono index, the question
 * and its answer: nothing to toggle, so it reads as content rather than a
 * control.
 */
const TileGrid = ({ fragment, as = 'h2' }: Props) => {
  const { title, subtitle, questions } = readFragment(
    FaqSectionFragment,
    fragment,
  );
  const headingId = `faq-${useId().replace(/[^\w-]/g, '')}`;

  if (!questions?.length) return null;

  // Questions sit one level below the section heading
  const QuestionHeading = as === 'h1' ? 'h2' : 'h3';

  return (
    <section
      className="section"
      aria-labelledby={title ? headingId : undefined}
    >
      <div className="container-page">
        <SectionTitle
          title={title}
          paragraph={subtitle}
          align="center"
          as={as}
          h1Size="section"
          id={headingId}
        />

        <ul className="reveal-stagger mx-auto grid max-w-[720px] gap-2 md:gap-4 lg:max-w-none lg:grid-cols-2">
          {questions.map((question, index) => (
            <li
              key={question.id}
              className="rounded-row bg-well p-[18px] md:p-6"
            >
              <p aria-hidden="true" className="mono">
                {String(index + 1).padStart(2, '0')}
              </p>
              <QuestionHeading className="mt-2.5 font-display text-[15.5px]/[1.4] font-medium tracking-[-0.01em] text-ink md:text-[16px]/[1.4]">
                {question.question}
              </QuestionHeading>
              <div className="prose prose-sm mt-2 text-ink-2">
                <DatoStructuredText data={question.answer} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TileGrid;
