import { useId } from 'react';
import DatoImage from '@/components/datocms/DatoImage';
import Announcement from '@/components/sections/HeroSection/Announcement';
import { HeroSectionFragment } from '@/components/sections/HeroSection/fragment';
import {
  HeroLead,
  HeroTitle,
} from '@/components/sections/HeroSection/HeroCopy';
import CmsButtons from '@/components/ui/CmsButtons';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';

type Props = {
  fragment: FragmentOf<typeof HeroSectionFragment>;
};

/**
 * `cover`: the block's image fills a panel under the header, drifting very
 * slowly, darkened towards the bottom so the copy reads in white over its
 * lower left corner. Needs an image: without one the hero is `centered`.
 */
const CoverHero = ({ fragment }: Props) => {
  const headingId = useId();
  const { title, subtitle, announcement, announcementLabel, buttons, cover } =
    readFragment(HeroSectionFragment, fragment);
  const focal = cover?.focalPoint;

  return (
    <section
      aria-labelledby={headingId}
      className="on-ink panel relative isolate overflow-hidden bg-ink text-surface"
    >
      {cover?.responsiveImage && (
        <div
          aria-hidden="true"
          className="breathe loop absolute inset-0 -z-20 [--loop-scale:1.06] [--loop-time:46s]"
        >
          <DatoImage
            fragment={cover.responsiveImage}
            alt=""
            layout="fill"
            objectFit="cover"
            objectPosition={
              focal ? `${focal.x * 100}% ${focal.y * 100}%` : undefined
            }
            // Below 1024px the panel is taller than the picture is wide, so it is drawn wider than the screen
            sizes="(min-width: 1500px) 1476px, (min-width: 1024px) 100vw, (min-width: 640px) 135vw, 260vw"
            priority
          />
        </div>
      )}
      {/* The navy of the dark panels, strongest where the copy sits */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(9_14_52/0.8),rgb(9_14_52/0.3)_52%,rgb(9_14_52/0.04))]"
      />
      <div className="container-page flex min-h-[34rem] flex-col justify-end pt-28 pb-9 sm:pb-12 lg:min-h-[min(45rem,calc(100svh-var(--header-h)-var(--inset)*2))] lg:pb-16">
        <Announcement
          field={announcement}
          label={announcementLabel}
          tone="glass"
          className="arrive self-start"
        />
        <HeroTitle
          id={headingId}
          title={title}
          className="arrive mt-6 max-w-[17ch] [--arrive:70ms]"
        />
        <HeroLead
          text={subtitle}
          className="arrive mt-6 max-w-[34rem] text-surface/85 [--arrive:150ms]"
        />
        <CmsButtons
          buttons={buttons}
          size="lg"
          tone="dark"
          className="arrive mt-9 [--arrive:230ms] max-sm:flex-col max-sm:items-stretch max-sm:[&>a]:w-full"
        />
      </div>
    </section>
  );
};

export default CoverHero;
