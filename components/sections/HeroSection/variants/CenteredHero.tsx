import { useId } from 'react';
import type { HeroSectionFragment } from '@/components/sections/HeroSection/fragment';
import type { FragmentOf } from '@/lib/datocms/graphql';
import CenteredText from './CenteredText';
import { UNDER_HEADER } from './SplitHero';

type Props = {
  fragment: FragmentOf<typeof HeroSectionFragment>;
};

/**
 * `centered` (the default): the announcement, headline, lead and buttons
 * centred on the tinted panel. The block's images are not shown in this
 * layout; `split` is the layout with images. Two faint rings breathe behind
 * the copy, as they do behind the split hero's picture.
 */
const CenteredHero = ({ fragment }: Props) => {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={`panel panel-tint relative isolate overflow-hidden ${UNDER_HEADER}`}
    >
      {/* The split hero's two thin rings, centred behind the copy and breathing slowly */}
      <span
        aria-hidden="true"
        className="breathe loop pointer-events-none absolute top-[55%] left-1/2 -z-10 size-[720px] -translate-1/2 rounded-full shadow-[inset_0_0_0_1px_rgb(255_255_255/0.75)] [--loop-scale:1.035] [--loop-time:28s]"
      />
      <span
        aria-hidden="true"
        className="breathe loop pointer-events-none absolute top-[55%] left-1/2 -z-10 size-[1080px] -translate-1/2 rounded-full shadow-[inset_0_0_0_1px_rgb(255_255_255/0.5)] [--loop-delay:-14s] [--loop-scale:0.975] [--loop-time:40s]"
      />
      <div className="container-page pt-14 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-32">
        <CenteredText fragment={fragment} headingId={headingId} />
      </div>
    </section>
  );
};

export default CenteredHero;
