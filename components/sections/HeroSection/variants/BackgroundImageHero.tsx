import { useId } from 'react';
import DatoImage from '@/components/datocms/DatoImage';
import { HeroSectionFragment } from '@/components/sections/HeroSection/fragment';
import HeroButtons from '@/components/sections/HeroSection/HeroButtons';
import HeroHeading from '@/components/sections/HeroSection/HeroHeading';
import HeroSubtitle from '@/components/sections/HeroSection/HeroSubtitle';
import { PresencePill, Threads } from '@/components/ui/Ornaments';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';

type Props = {
  fragment: FragmentOf<typeof HeroSectionFragment>;
};

/**
 * The "photo stage": the CMS image fills a container-wide rounded stage, left
 * as it is (no scrim, no tint, no text on the photo), and the copy sits in a
 * white card floating over its bottom-left corner. Below 1024 the card drops
 * under the photo and overlaps it (64px, 40px below 768), so the photo is never
 * mostly covered. Without an image the stage is an accent well of threads.
 * Below 768 the H1 scales from 28 to 32px with the viewport, so each half of
 * the title keeps its own line inside the card's padding.
 */
const BackgroundImageHero = ({ fragment }: Props) => {
  const headingId = useId();
  const { heroTitle, heroSubtitle, buttons, heroImage } = readFragment(
    HeroSectionFragment,
    fragment,
  );
  const image = heroImage?.responsiveImage;

  return (
    <section
      aria-labelledby={headingId}
      className="pt-6 pb-20 max-md:pt-4 max-md:pb-14"
    >
      <div className="container-page">
        <div className="relative lg:h-[560px]">
          {image ? (
            <div className="photo aspect-[4/3] rounded-well max-md:rounded-card md:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto">
              <DatoImage
                fragment={image}
                layout="fill"
                objectFit="cover"
                objectPosition="50% 50%"
                sizes="(min-width: 1280px) 1200px, 100vw"
                priority
              />
            </div>
          ) : (
            <div className="well aspect-[4/3] md:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto">
              <Threads shape="plinth" draw="load" />
            </div>
          )}
          <PresencePill className="hero-float absolute top-3 right-3 z-10 [--d:2] md:top-5 md:right-5 lg:top-6 lg:right-6" />

          <div className="float relative z-10 -mt-10 rounded-card p-5 md:mx-6 md:-mt-16 md:p-8 lg:absolute lg:bottom-6 lg:left-6 lg:m-0 lg:w-[584px] lg:max-w-[calc(100%-48px)] lg:p-10">
            <HeroHeading
              id={headingId}
              title={heroTitle}
              className="text-h1 max-md:text-[length:clamp(28px,10.4vw_-_8.5px,32px)] max-md:tracking-[-0.035em] md:text-[44px] md:leading-[1.06]"
            />
            <HeroSubtitle
              text={heroSubtitle}
              className="mt-4 text-lead text-ink-2 [&_p+p]:mt-3"
            />
            <HeroButtons buttons={buttons} rise={2} className="mt-6" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BackgroundImageHero;
