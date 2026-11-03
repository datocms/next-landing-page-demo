import { useId } from 'react';
import DatoImage from '@/components/datocms/DatoImage';
import { HeroSectionFragment } from '@/components/sections/HeroSection/fragment';
import HeroButtons from '@/components/sections/HeroSection/HeroButtons';
import HeroHeading from '@/components/sections/HeroSection/HeroHeading';
import HeroSubtitle from '@/components/sections/HeroSection/HeroSubtitle';
import { PresencePill, Threads } from '@/components/ui/Ornaments';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import TogglesCard from './TogglesCard';

type Props = {
  fragment: FragmentOf<typeof HeroSectionFragment>;
};

/** The asset caption row under the photo card: a tone dot and two bars. Decorative */
const PhotoCaption = () => (
  <div
    aria-hidden="true"
    className="flex h-[30px] items-center gap-2 px-2 max-md:h-[26px]"
  >
    <span className="dot tone-0" />
    <span className="h-1.5 w-[72px] rounded-[3px] bg-sk-2 max-md:w-14" />
    <span className="h-1.5 w-10 rounded-[3px] bg-surface" />
  </div>
);

/**
 * Default hero, the "plinth": a two-tone H1, lead and CTAs on the left; on the
 * right an accent well of drawn threads carrying the CMS photo as a media card,
 * a presence pill and a settings card. The floats are wordless and decorative.
 * Without an image the plinth keeps its height, threads and floats.
 */
const DefaultHero = ({ fragment }: Props) => {
  const headingId = useId();
  const { heroTitle, heroSubtitle, buttons, heroImage } = readFragment(
    HeroSectionFragment,
    fragment,
  );
  const image = heroImage?.responsiveImage;
  // Under the photo card, or in its place when there is no image
  const pillPosition = image
    ? 'top-[222px] left-[40.1%] max-md:top-40 max-md:left-[118px]'
    : 'top-10 left-[6.8%] max-md:top-5 max-md:left-5';

  return (
    <section
      id="home"
      aria-labelledby={headingId}
      className="pt-12 pb-10 max-lg:pt-10 max-lg:pb-16 max-md:pt-8 max-md:pb-14"
    >
      <div className="container-page grid-page items-center">
        <div className="col-span-full max-w-[620px] lg:col-span-6 lg:max-w-none">
          <HeroHeading
            id={headingId}
            title={heroTitle}
            className="max-w-[588px] text-h1"
          />
          <HeroSubtitle
            text={heroSubtitle}
            className="mt-[18px] max-w-[520px] text-lead text-ink-2 max-md:mt-4 [&_p+p]:mt-3"
          />
          <HeroButtons
            buttons={buttons}
            rise={2}
            className="mt-7 max-md:mt-6"
          />
        </div>

        <div className="well col-span-full mt-10 h-[420px] max-md:mt-7 max-md:h-[252px] lg:col-span-6 lg:mt-0 lg:h-[448px]">
          <Threads shape="plinth" draw="load" />
          {image && (
            <figure className="float absolute top-10 left-[6.8%] z-10 rounded-[18px] p-[5px] max-md:top-5 max-md:left-5">
              <div className="photo h-[208px] w-[312px] rounded-[14px] max-md:h-[154px] max-md:w-[232px]">
                <DatoImage
                  fragment={image}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="50% 50%"
                  sizes="(min-width: 768px) 312px, 232px"
                  priority
                />
              </div>
              <PhotoCaption />
            </figure>
          )}
          <PresencePill
            className={cn('hero-float absolute z-20 [--d:1]', pillPosition)}
          />
          <TogglesCard className="hero-float absolute right-[5.4%] bottom-9 z-10 [--d:2] max-md:hidden" />
        </div>
      </div>
    </section>
  );
};

export default DefaultHero;
