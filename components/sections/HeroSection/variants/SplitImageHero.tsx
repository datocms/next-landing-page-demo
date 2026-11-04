import { type CSSProperties, useId } from 'react';
import DatoImage from '@/components/datocms/DatoImage';
import { HeroSectionFragment } from '@/components/sections/HeroSection/fragment';
import HeroButtons from '@/components/sections/HeroSection/HeroButtons';
import HeroSubtitle from '@/components/sections/HeroSection/HeroSubtitle';
import HeroTitle from '@/components/sections/HeroSection/HeroTitle';
import { PresencePill, Threads } from '@/components/ui/Ornaments';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';

type Props = {
  fragment: FragmentOf<typeof HeroSectionFragment>;
};

/** The copy tile's accent glow, rising from its bottom-left corner */
const tileStyle: CSSProperties = {
  background:
    'radial-gradient(90% 70% at 0% 100%, color-mix(in oklch, var(--g-100) 90%, transparent), transparent 70%), var(--bg-2)',
};

/**
 * `split_image`: the copy in a glowing well with a ribbon of threads, beside
 * the CMS photo in a tile of its own; without an image the copy tile spans
 * the row.
 */
const SplitImageHero = ({ fragment }: Props) => {
  const headingId = useId();
  const { heroTitle, heroSubtitle, buttons, heroImage } = readFragment(
    HeroSectionFragment,
    fragment,
  );
  const image = heroImage?.responsiveImage;
  // Beside the photo the copy keeps a narrower measure
  const copyWidth = image ? 'max-w-[492px]' : 'max-w-[588px]';

  return (
    <section
      aria-labelledby={headingId}
      className="pt-6 pb-20 max-md:pt-4 max-md:pb-14"
    >
      <div
        className={cn(
          'container-page grid gap-4 max-md:gap-3',
          image && 'lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:grid-cols-2',
        )}
      >
        <div
          className="well flex flex-col p-12 pb-[176px] max-lg:p-10 max-lg:pb-[160px] max-md:p-5 max-md:pb-[120px] lg:min-h-[540px]"
          style={tileStyle}
        >
          <Threads
            shape="ribbon"
            draw="load"
            className="top-auto h-[136px] max-lg:h-28 max-md:h-24"
          />
          <HeroTitle
            id={headingId}
            title={heroTitle}
            size="compact"
            className={copyWidth}
          />
          <HeroSubtitle
            text={heroSubtitle}
            className={cn('mt-4 text-lead text-ink-2 [&_p+p]:mt-3', copyWidth)}
          />
          <HeroButtons
            buttons={buttons}
            tone="ink"
            className="mt-7 max-md:mt-6"
          />
        </div>

        {image && (
          <div className="photo rounded-well max-lg:aspect-[16/9] max-md:aspect-[4/3] max-md:rounded-card">
            <DatoImage
              fragment={image}
              layout="fill"
              objectFit="cover"
              objectPosition="50% 50%"
              sizes="(min-width: 1200px) 592px, (min-width: 1024px) 40vw, 100vw"
              priority
            />
            <PresencePill className="hero-float absolute bottom-6 left-6 z-10 [--d:1] max-md:bottom-3 max-md:left-3" />
          </div>
        )}
      </div>
    </section>
  );
};

export default SplitImageHero;
