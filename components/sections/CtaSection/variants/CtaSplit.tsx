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
 * `split`: the navy panel with the title large on the left and the line and
 * the buttons on the right, aligned to its last line. Flat shapes instead of
 * rings: an accent disc drifting in the top-right corner, a pale quarter
 * circle in the bottom-left. Joins the footer like the centred one.
 */
const CtaSplit = ({ fragment, as: Heading = 'h2' }: Props) => {
  const headingId = useId();
  const { title, subtitle, buttons } = readFragment(
    CtaSectionFragment,
    fragment,
  );
  const scale = titleSize(title, 'h1');

  return (
    <section
      data-closing=""
      aria-labelledby={headingId}
      className="panel panel-ink relative isolate mt-(--section-space) overflow-hidden rounded-b-none"
    >
      <span
        aria-hidden="true"
        className="cta-drift loop pointer-events-none absolute -top-36 -right-28 -z-10 size-[clamp(10rem,19vw,15rem)] rounded-full bg-accent"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 -z-10 size-[clamp(8rem,16vw,13rem)] rounded-tr-full bg-[rgb(255_255_255/0.07)]"
      />
      <div className="container-page grid gap-x-16 gap-y-8 py-20 sm:py-24 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:pt-32 lg:pb-28">
        <Heading
          id={headingId}
          data-long={scale.long}
          className={`reveal ${scale.className} max-w-[14ch]`}
        >
          {title}
        </Heading>
        <div className="reveal [--reveal-delay:120ms]">
          {hasStructuredText(subtitle) && (
            <div className="max-w-[28rem] text-lead text-surface/70 [&_p+p]:mt-3">
              <DatoStructuredText data={subtitle} />
            </div>
          )}
          <CmsButtons
            buttons={buttons}
            size="lg"
            tone="dark"
            className="mt-8 max-sm:flex-col max-sm:items-stretch max-sm:[&>a]:w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default CtaSplit;
