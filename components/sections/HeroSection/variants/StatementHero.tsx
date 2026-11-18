import { stripStega } from '@datocms/content-link';
import { useId } from 'react';
import DatoImage from '@/components/datocms/DatoImage';
import ProductCard from '@/components/product/ProductCard';
import Announcement from '@/components/sections/HeroSection/Announcement';
import { HeroSectionFragment } from '@/components/sections/HeroSection/fragment';
import { HeroLead } from '@/components/sections/HeroSection/HeroCopy';
import CmsButtons from '@/components/ui/CmsButtons';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import styles from './StatementHero.module.css';

type Props = {
  fragment: FragmentOf<typeof HeroSectionFragment>;
  locale: string;
};

type Portrait = {
  focalPoint?: { x: number; y: number } | null;
  responsiveImage?: Parameters<typeof DatoImage>[0]['fragment'] | null;
} | null;

/** One of the two side arches: an image, its top a half circle */
const ImageArch = ({
  image,
  className,
}: {
  image: Portrait;
  className?: string;
}) =>
  image?.responsiveImage ? (
    <div className={cn(styles.arch, styles.side, className)}>
      <div className={cn(styles.drift, 'loop')}>
        <DatoImage
          fragment={image.responsiveImage}
          alt=""
          layout="fill"
          objectFit="cover"
          objectPosition={
            image.focalPoint
              ? `${image.focalPoint.x * 100}% ${image.focalPoint.y * 100}%`
              : undefined
          }
          sizes="(min-width: 1024px) 340px, 30vw"
          priority
        />
      </div>
    </div>
  ) : (
    <div className={cn(styles.arch, styles.side, styles.blank, className)} />
  );

/**
 * `statement`: the whole hero on a solid panel of the accent, everything
 * centred. The headline is set very large in white over the lead and the
 * buttons; from the panel's bottom edge rise three arches: the two images on
 * the sides, and in the middle a white arch holding the product cards under
 * the highlight. Faint arch outlines echo them behind. On load the copy rises
 * line by line and the arches grow up out of the edge; the images then drift
 * very slowly. Below 640px only the middle arch shows.
 */
const StatementHero = ({ fragment, locale }: Props) => {
  const headingId = useId();
  const {
    title,
    subtitle,
    announcement,
    announcementLabel,
    buttons,
    portrait,
    secondaryPortrait,
    productCards,
    highlight,
  } = readFragment(HeroSectionFragment, fragment);
  const long = stripStega(title).trim().length >= 53;

  return (
    <section
      data-hero="statement"
      aria-labelledby={headingId}
      className={cn(
        'on-ink panel relative isolate overflow-hidden text-on-accent',
        styles.panel,
      )}
    >
      <div className="container-page flex flex-col items-center pt-12 text-center sm:pt-16 lg:pt-20">
        <Announcement
          field={announcement}
          label={announcementLabel}
          className="arrive"
        />
        <h1
          id={headingId}
          className={cn(
            'arrive mt-7 max-w-[16ch] text-balance font-semibold leading-[0.98] tracking-[-0.055em] [--arrive:70ms]',
            long
              ? 'text-[clamp(2.375rem,6vw,5rem)]'
              : 'text-[clamp(2.75rem,7.6vw,6.5rem)]',
          )}
        >
          {title}
        </h1>
        <HeroLead
          text={subtitle}
          className="arrive mt-6 max-w-[36rem] text-on-accent [--arrive:150ms]"
        />
        <CmsButtons
          buttons={buttons}
          size="lg"
          align="center"
          tone="dark"
          className="arrive mt-9 w-full [--arrive:230ms] max-sm:flex-col max-sm:[&>a]:w-full"
        />
      </div>

      <div
        aria-hidden="true"
        className={cn(
          'container-page relative mt-14 select-none lg:mt-20',
          styles.stage,
        )}
      >
        <span className={cn(styles.outline, styles.outlineFar)} />
        <span className={cn(styles.outline, styles.outlineNear)} />
        <ImageArch
          image={portrait}
          className="arrive-settle [--arrive:380ms]"
        />
        <div
          className={cn(
            styles.arch,
            styles.middle,
            'arrive-settle [--arrive:260ms]',
          )}
        >
          {highlight && (
            <div className="flex h-9 items-center gap-2 rounded-full bg-accent-soft pr-4 pl-2 font-semibold text-[0.8125rem] text-accent-ink whitespace-nowrap">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
                <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
                  <path
                    d="m2.5 6.3 2.3 2.3 4.7-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {highlight}
            </div>
          )}
          <div className="mt-5 flex w-full flex-col gap-2.5">
            {productCards.slice(0, 3).map((card, index) => (
              <ProductCard
                key={card.id}
                card={card}
                locale={locale}
                className={cn(
                  'arrive-float loop',
                  [
                    '[--arrive:620ms] [--float-time:15s]',
                    '[--arrive:740ms] [--float-time:19s] [--float-y:-4px]',
                    '[--arrive:860ms] [--float-time:17s] [--float-y:-6px]',
                  ][index],
                )}
              />
            ))}
          </div>
        </div>
        <ImageArch
          image={secondaryPortrait}
          className="arrive-settle [--arrive:500ms]"
        />
      </div>
    </section>
  );
};

export default StatementHero;
