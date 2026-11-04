import { type CSSProperties, useId } from 'react';
import { HeroSectionFragment } from '@/components/sections/HeroSection/fragment';
import HeroButtons from '@/components/sections/HeroSection/HeroButtons';
import HeroSubtitle from '@/components/sections/HeroSection/HeroSubtitle';
import HeroTitle from '@/components/sections/HeroSection/HeroTitle';
import { Threads } from '@/components/ui/Ornaments';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import ProductWindow from './ProductWindow';

type Props = {
  fragment: FragmentOf<typeof HeroSectionFragment>;
};

/** Two soft accent glows: one behind the copy, one rising under the window */
const glowStyle: CSSProperties = {
  background:
    'radial-gradient(60% 50% at 50% 0%, var(--g-100), transparent 72%), radial-gradient(42% 36% at 50% 78%, color-mix(in oklch, var(--g-200) 55%, transparent), transparent 70%)',
};

/** The threads start drawing after the copy has settled */
const threadsStyle = { '--draw-delay': '700ms' };

/**
 * `gradient`: centred copy on an accent glow above a product window whose
 * media panel is the CMS image, with threads plugging into the window's ports.
 */
const GradientHero = ({ fragment }: Props) => {
  const headingId = useId();
  const { heroTitle, heroSubtitle, buttons, heroImage } = readFragment(
    HeroSectionFragment,
    fragment,
  );

  return (
    <section
      aria-labelledby={headingId}
      className="relative isolate overflow-clip pt-16 max-md:pt-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px]"
        style={glowStyle}
      />
      <div className="container-page flex flex-col items-center text-center">
        <HeroTitle id={headingId} title={heroTitle} className="max-w-[680px]" />
        <HeroSubtitle
          text={heroSubtitle}
          className="mt-4 max-w-[640px] text-balance text-lead text-ink-2 [&_p+p]:mt-3"
        />
        {/* Full column width, so a long label truncates instead of widening the row */}
        <HeroButtons
          buttons={buttons}
          tone="ink"
          align="center"
          className="mt-6 self-stretch"
        />

        <Threads
          shape="convergeTop"
          draw="load"
          style={threadsStyle}
          className="relative mt-6 h-[88px] w-screen max-w-none flex-none opacity-90 min-[1180px]:hidden"
        />

        <div className="relative mx-auto mt-12 h-[400px] w-[min(1040px,100%)] text-left max-[1180px]:mt-0 max-md:h-auto">
          <Threads
            shape="converge"
            draw="load"
            style={threadsStyle}
            className="top-0 right-[calc(100%-44px)] left-auto z-0 hidden h-[400px] w-[max(120px,calc(50vw_-_50%_+_44px))] opacity-90 min-[1180px]:block"
          />
          <Threads
            shape="converge"
            draw="load"
            style={threadsStyle}
            className="top-0 right-auto left-[calc(100%-44px)] z-0 hidden h-[400px] w-[max(120px,calc(50vw_-_50%_+_44px))] -scale-x-100 opacity-90 min-[1180px]:block"
          />
          <span
            aria-hidden="true"
            className="port top-[190px] -left-1 hidden h-[52px] w-2 min-[1180px]:block"
          />
          <span
            aria-hidden="true"
            className="port top-[190px] -right-1 hidden h-[52px] w-2 min-[1180px]:block"
          />
          <span
            aria-hidden="true"
            className="port -top-1 left-[calc(50%-26px)] h-2 w-[52px] min-[1180px]:hidden"
          />

          {/* The mask fades the window out before the hero's bottom edge cuts it; the px-12
              gutter keeps the window's side shadows inside the masked box */}
          <div
            data-hero-win=""
            className="relative z-[1] -mx-12 px-12 [mask-image:linear-gradient(#000_284px,transparent_398px)] max-md:mx-0 max-md:px-0 max-md:[mask-image:linear-gradient(#000_70%,transparent_98%)]"
          >
            <ProductWindow image={heroImage?.responsiveImage} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GradientHero;
