import { Plus } from 'lucide-react';
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
 * Accordion (the "accordion" option): a sticky head on the left and native
 * <details> pill rows on the right. The first row is open in the server HTML
 * (so it is open without JS); several rows can be open at once, and links
 * inside answers never toggle.
 */
const Accordion = ({ fragment, as = 'h2' }: Props) => {
  const { title, subtitle, questions } = readFragment(
    FaqSectionFragment,
    fragment,
  );
  const headingId = `faq-${useId().replace(/[^\w-]/g, '')}`;

  if (!questions?.length) return null;

  return (
    <section
      className="section"
      aria-labelledby={title ? headingId : undefined}
    >
      <div className="container-page grid items-start lg:grid-cols-12 lg:gap-x-6">
        <div className="mb-6 max-w-[620px] md:mb-8 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-4 lg:mb-0 lg:max-w-none">
          <SectionTitle
            title={title}
            paragraph={subtitle}
            as={as}
            h1Size="section"
            gap="none"
            id={headingId}
          />
        </div>

        <div className="reveal grid gap-2 lg:col-span-7 lg:col-start-6">
          {questions.map((question, index) => (
            <details
              key={question.id}
              className="disclosure disclosure-pill group"
              open={index === 0}
            >
              <summary className="max-md:pr-3 max-md:pl-[18px]">
                <span className="font-display text-[15.5px]/[1.4] font-medium tracking-[-0.01em] text-balance text-ink md:text-[16px]/[1.4]">
                  {question.question}
                </span>
                <span
                  aria-hidden="true"
                  className="grid size-7 flex-none place-items-center rounded-full bg-white text-ink-2 shadow-xs transition-[background-color,box-shadow] duration-250 ease-out-expo group-open:bg-well group-open:shadow-none"
                >
                  <Plus strokeWidth={2} className="disclosure-icon size-3.5" />
                </span>
              </summary>
              <div className="prose prose-sm pr-16 pb-5 pl-5 text-ink-2 max-md:px-[18px] max-md:pb-[18px]">
                <DatoStructuredText data={question.answer} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Accordion;
