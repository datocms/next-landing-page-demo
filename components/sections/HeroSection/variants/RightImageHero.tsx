import { useId } from 'react';
import DatoImage from '@/components/datocms/DatoImage';
import { HeroSectionFragment } from '@/components/sections/HeroSection/fragment';
import HeroCopyColumn from '@/components/sections/HeroSection/HeroCopyColumn';
import { Bars, Chart, Lock } from '@/components/ui/Ornaments';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';

type Props = {
  fragment: FragmentOf<typeof HeroSectionFragment>;
};

/**
 * `right_image`: the copy beside three tiles, the CMS photo in the wide one
 * and two wordless mini-UIs under it; without an image the wide tile shows a
 * chart drawing.
 */
const RightImageHero = ({ fragment }: Props) => {
  const headingId = useId();
  const { heroTitle, heroSubtitle, buttons, heroImage } = readFragment(
    HeroSectionFragment,
    fragment,
  );
  const image = heroImage?.responsiveImage;

  return (
    <section
      aria-labelledby={headingId}
      className="pt-12 pb-10 max-lg:pt-10 max-lg:pb-16 max-md:pt-8 max-md:pb-14"
    >
      <div className="container-page grid-page items-center">
        <HeroCopyColumn
          headingId={headingId}
          title={heroTitle}
          subtitle={heroSubtitle}
          buttons={buttons}
        />

        <div className="col-span-full mt-10 grid h-[420px] grid-cols-2 grid-rows-[minmax(0,1fr)_152px] gap-4 max-md:mt-7 max-md:h-auto max-md:grid-rows-none max-md:gap-3 lg:col-span-6 lg:mt-0 lg:h-[448px] lg:grid-rows-[minmax(0,1fr)_168px]">
          {image ? (
            <div className="photo col-span-2 rounded-card max-md:aspect-[16/10]">
              <DatoImage
                fragment={image}
                layout="fill"
                objectFit="cover"
                objectPosition="50% 50%"
                sizes="(min-width: 1280px) 588px, (min-width: 1024px) 50vw, 100vw"
                priority
              />
              <span
                aria-hidden="true"
                className="float absolute bottom-4 left-4 z-10 flex h-8 items-center gap-2 rounded-full px-3 max-md:bottom-3 max-md:left-3"
              >
                <span className="dot tone-1" />
                <span className="h-1.5 w-14 rounded-[3px] bg-sk-2" />
              </span>
            </div>
          ) : (
            <div className="tone-2 zone-glow col-span-2 grid place-items-center rounded-card p-4 max-md:aspect-[16/10]">
              <Chart className="size-full" />
            </div>
          )}
          <div className="card tone-1 hero-float p-2 [--d:-1] max-md:h-[112px]">
            <div className="zone-glow grid h-full place-items-center rounded-tile">
              <Bars className="size-full" />
            </div>
          </div>
          <div className="card tone-4 hero-float p-2 [--d:0] max-md:h-[112px]">
            <div className="zone-glow grid h-full place-items-center rounded-tile">
              <Lock className="size-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RightImageHero;
