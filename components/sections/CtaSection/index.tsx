import { stripStega } from '@datocms/content-link';
import { useId } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import CmsButtons from '@/components/ui/CmsButtons';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { SectionHeadingLevel } from '@/utils/headingLevel';
import { hasStructuredText } from '@/utils/structuredText';
import { titleSize } from '@/utils/titleSize';
import { CtaSectionFragment } from './fragment';
import CtaArch from './variants/CtaArch';
import CtaSplit from './variants/CtaSplit';

type Props = {
  fragment: FragmentOf<typeof CtaSectionFragment>;
  as?: SectionHeadingLevel;
};

/**
 * `centered` (the default; `split` and `arch` are in variants/): the closing call to action, a title, one line and the buttons, centred on
 * the navy panel. As the last block of a page it joins the footer, which is the
 * same navy, into one panel (`data-closing` tells the footer). Faint rings
 * breathe in its top-right corner (the footer answers them bottom-left).
 */
const CtaSection = ({ fragment, as: Heading = 'h2' }: Props) => {
  const headingId = useId();
  const { title, subtitle, buttons, layout } = readFragment(
    CtaSectionFragment,
    fragment,
  );
  const scale = titleSize(title, 'h1');
  const variant = stripStega(layout ?? '').trim();
  if (variant === 'split') return <CtaSplit fragment={fragment} as={Heading} />;
  if (variant === 'arch') return <CtaArch fragment={fragment} as={Heading} />;

  return (
    <section
      data-closing=""
      aria-labelledby={headingId}
      className="panel panel-ink relative isolate mt-(--section-space) overflow-hidden rounded-b-none"
    >
      {/* The strong tiles' faint rings, larger, in the panel's top-right corner, breathing slowly */}
      <span
        aria-hidden="true"
        className="breathe loop pointer-events-none absolute -top-[130px] -right-[130px] -z-10 size-[260px] rounded-full shadow-[0_0_0_64px_rgb(255_255_255/0.04),0_0_0_136px_rgb(255_255_255/0.026),0_0_0_216px_rgb(255_255_255/0.016)] [--loop-scale:1.06] [--loop-time:44s]"
      />
      <div className="container-page flex flex-col items-center py-20 text-center sm:py-24 lg:pt-32 lg:pb-28">
        <Heading
          id={headingId}
          data-long={scale.long}
          className={`${scale.className} max-w-[20ch]`}
        >
          {title}
        </Heading>
        {hasStructuredText(subtitle) && (
          <div className="mt-4 max-w-[36rem] text-lead text-surface/70 [&_p+p]:mt-3">
            <DatoStructuredText data={subtitle} />
          </div>
        )}
        <CmsButtons
          buttons={buttons}
          size="lg"
          align="center"
          tone="dark"
          className="mt-8 w-full max-sm:flex-col max-sm:[&>a]:w-full"
        />
      </div>
    </section>
  );
};

export default CtaSection;
