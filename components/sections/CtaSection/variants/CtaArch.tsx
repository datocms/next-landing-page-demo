import { useId } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import CmsButtons from '@/components/ui/CmsButtons';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { SectionHeadingLevel } from '@/utils/headingLevel';
import { hasStructuredText } from '@/utils/structuredText';
import { titleSize } from '@/utils/titleSize';
import { CtaSectionFragment } from '../fragment';

type Props = {
  fragment: FragmentOf<typeof CtaSectionFragment>;
  as?: SectionHeadingLevel;
};

/**
 * `arch`: a panel of the deep accent with a white arch rising from its bottom
 * edge, the title, the line and the buttons centred inside it, and two faint
 * arch outlines behind. The footer under it takes the same accent
 * (`data-closing="accent"`), so the arch stands on it.
 */
const CtaArch = ({ fragment, as: Heading = 'h2' }: Props) => {
  const headingId = useId();
  const { title, subtitle, buttons } = readFragment(
    CtaSectionFragment,
    fragment,
  );
  const scale = titleSize(title, 'h1');

  return (
    <section
      data-closing="accent"
      aria-labelledby={headingId}
      className="on-ink panel relative isolate mt-(--section-space) overflow-hidden rounded-b-none bg-(--accent-deep)"
    >
      <div className="container-page relative flex justify-center pt-16 sm:pt-20 lg:pt-24">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[118%] w-[min(60rem,150%)] -translate-x-1/2 rounded-t-full border border-[rgb(255_255_255/0.08)] border-b-0"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[100%] w-[min(46rem,120%)] -translate-x-1/2 rounded-t-full border border-[rgb(255_255_255/0.16)] border-b-0"
        />
        <div className="flex w-full max-w-[40rem] flex-col items-center rounded-t-[999px] bg-surface px-6 pt-24 pb-14 text-center text-fg sm:px-12 sm:pt-28 lg:pt-32 lg:pb-16">
          <Heading
            id={headingId}
            data-long={scale.long}
            className={`${scale.className} max-w-[14ch]`}
          >
            {title}
          </Heading>
          {hasStructuredText(subtitle) && (
            <div className="mt-4 max-w-[28rem] text-fg-muted text-lead [&_p+p]:mt-3">
              <DatoStructuredText data={subtitle} />
            </div>
          )}
          <CmsButtons
            buttons={buttons}
            size="lg"
            align="center"
            className="mt-8 w-full max-sm:flex-col max-sm:[&>a]:w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default CtaArch;
