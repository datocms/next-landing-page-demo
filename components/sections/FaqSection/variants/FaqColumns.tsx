import type { CSSProperties } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { FaqSectionFragment } from '@/components/sections/FaqSection/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import styles from '../FaqSection.module.css';
import FloatingMarks from '../FloatingMarks';
import SettleIn from '../SettleIn';

type Props = {
  fragment: FragmentOf<typeof FaqSectionFragment>;
};

// Two tiles a line from 1024px, wide then narrow and the other way round on
// the next line, in the two pale fills
const PATTERN = [
  'lg:col-span-7 bg-subtle',
  'lg:col-span-5 bg-tint',
  'lg:col-span-5 bg-tint',
  'lg:col-span-7 bg-subtle',
];

/**
 * `columns` (the default): every question with its
 * answer visible, nothing to open, as a mosaic of pale tiles: a small
 * question mark chip, the question, the answer. Two in a line from 768px
 * (staggered widths from 1024px); a last tile alone on its line takes the
 * whole width. Large pale question marks drift behind the section; a chip
 * tilts a little when its tile is hovered.
 */
const FaqColumns = ({ fragment }: Props) => {
  const { questions } = readFragment(FaqSectionFragment, fragment);

  return (
    <section className={cn(styles.root, 'section relative isolate')}>
      <FloatingMarks layout="columns" />
      <SettleIn className="container-page">
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          {questions.map((question, index) => {
            const alone =
              index === questions.length - 1 && questions.length % 2 === 1;

            return (
              <li
                key={question.id}
                style={{ '--i': index } as CSSProperties}
                className={cn(
                  styles.settleItem,
                  styles.tile,
                  'flex gap-5 rounded-card p-6 sm:p-8',
                  PATTERN[index % PATTERN.length],
                  alone && 'md:col-span-2 lg:col-span-12',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    styles.chip,
                    'grid size-10 shrink-0 place-items-center rounded-full bg-surface text-[1.0625rem] font-semibold text-accent',
                  )}
                >
                  ?
                </span>
                <div className="min-w-0 pt-1.5">
                  <h2 className="text-[1.25rem] leading-[1.25] font-semibold tracking-[-0.025em]">
                    {question.question}
                  </h2>
                  <div className="prose mt-3 max-w-[60ch] text-body text-fg-muted">
                    <DatoStructuredText data={question.answer} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </SettleIn>
    </section>
  );
};

export default FaqColumns;
