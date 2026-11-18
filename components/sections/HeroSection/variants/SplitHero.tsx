import { useId } from 'react';
import Announcement from '@/components/sections/HeroSection/Announcement';
import { HeroSectionFragment } from '@/components/sections/HeroSection/fragment';
import {
  HeroLead,
  HeroTitle,
} from '@/components/sections/HeroSection/HeroCopy';
import HeroStage from '@/components/sections/HeroSection/HeroStage';
import CmsButtons from '@/components/ui/CmsButtons';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';

type Props = {
  fragment: FragmentOf<typeof HeroSectionFragment>;
  locale: string;
};

/** Slides a hero panel up behind the transparent header, down to the panel inset */
export const UNDER_HEADER =
  '-mt-[calc(var(--header-h)-var(--inset))] pt-[calc(var(--header-h)-var(--inset))]';

/**
 * `split`: a tinted panel with the copy on the left and, on the right, the
 * block's images as two capsules under small pieces of the product. Below
 * 1024px the picture sits under the copy. On load the copy rises in line by
 * line while the picture assembles itself (styles/motion.css).
 */
const SplitHero = ({ fragment, locale }: Props) => {
  const headingId = useId();
  const {
    title,
    subtitle,
    announcement,
    announcementLabel,
    buttons,
    image,
    secondaryImage,
    productCards,
    highlight,
  } = readFragment(HeroSectionFragment, fragment);

  return (
    <section
      aria-labelledby={headingId}
      className={`panel panel-tint overflow-hidden ${UNDER_HEADER}`}
    >
      <div className="container-page grid grid-cols-[minmax(0,1fr)] items-center gap-x-10 gap-y-8 lg:min-h-[42.5rem] lg:grid-cols-[minmax(0,1fr)_36.25rem]">
        <div className="pt-10 sm:pt-14 lg:py-16">
          <Announcement
            field={announcement}
            label={announcementLabel}
            className="arrive"
          />
          <HeroTitle
            id={headingId}
            title={title}
            className="arrive mt-6 [--arrive:70ms]"
          />
          <HeroLead
            text={subtitle}
            className="arrive mt-6 max-w-[33.75rem] text-fg/80 [--arrive:150ms]"
          />
          <CmsButtons
            buttons={buttons}
            size="lg"
            className="arrive mt-9 [--arrive:230ms] max-sm:flex-col max-sm:items-stretch max-sm:[&>a]:w-full"
          />
        </div>
        {image?.responsiveImage && (
          <HeroStage
            image={{
              focalPoint: image.focalPoint,
              responsiveImage: image.responsiveImage,
            }}
            secondary={
              secondaryImage?.responsiveImage
                ? {
                    focalPoint: secondaryImage.focalPoint,
                    responsiveImage: secondaryImage.responsiveImage,
                  }
                : null
            }
            cards={productCards}
            highlight={highlight}
            locale={locale}
            className="max-lg:mb-8"
          />
        )}
      </div>
    </section>
  );
};

export default SplitHero;
