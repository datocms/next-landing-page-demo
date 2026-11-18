import { useId } from 'react';
import DatoImage from '@/components/datocms/DatoImage';
import ProductCard from '@/components/product/ProductCard';
import Announcement from '@/components/sections/HeroSection/Announcement';
import { HeroSectionFragment } from '@/components/sections/HeroSection/fragment';
import {
  HeroLead,
  HeroTitle,
} from '@/components/sections/HeroSection/HeroCopy';
import CmsButtons from '@/components/ui/CmsButtons';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import styles from './MosaicHero.module.css';

type Props = {
  fragment: FragmentOf<typeof HeroSectionFragment>;
  locale: string;
};

const focus = (point?: { x: number; y: number } | null) =>
  point ? `${point.x * 100}% ${point.y * 100}%` : undefined;

/**
 * `mosaic`: no panel, the page's white. The headline is set large on the left
 * with the lead and the buttons beside it on the right, aligned to its last
 * line; under them runs a mosaic of tiles across the whole container: the
 * image cut with one round corner, the secondary image as an arch, product
 * cards on a pale tile, the highlight, and flat shapes in the accent, navy and
 * pale tints. On load the tiles settle one after another; then the shapes move
 * very slowly (a sun rising, a moon circling). Static under reduced motion.
 */
const MosaicHero = ({ fragment, locale }: Props) => {
  const headingId = useId();
  const {
    title,
    subtitle,
    announcement,
    announcementLabel,
    buttons,
    square,
    secondaryPortrait,
    productCards,
    highlight,
  } = readFragment(HeroSectionFragment, fragment);

  return (
    <section
      data-hero="mosaic"
      aria-labelledby={headingId}
      className="section-lead"
    >
      <div className="container-page">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <Announcement
              field={announcement}
              label={announcementLabel}
              className="arrive"
            />
            <HeroTitle
              id={headingId}
              title={title}
              className="arrive mt-6 max-w-[14ch] [--arrive:70ms]"
            />
          </div>
          <div className="lg:pb-2">
            <HeroLead
              text={subtitle}
              className="arrive max-w-[30rem] text-fg/80 [--arrive:150ms]"
            />
            <CmsButtons
              buttons={buttons}
              size="lg"
              className="arrive mt-8 [--arrive:230ms] max-sm:flex-col max-sm:items-stretch max-sm:[&>a]:w-full"
            />
          </div>
        </div>

        <div aria-hidden="true" className={cn(styles.mosaic, 'mt-12 lg:mt-16')}>
          <div
            className={cn(
              styles.tile,
              styles.a,
              'arrive-settle bg-tint [--arrive:300ms]',
            )}
          >
            {square?.responsiveImage && (
              <DatoImage
                fragment={square.responsiveImage}
                alt=""
                layout="fill"
                objectFit="cover"
                objectPosition={focus(square.focalPoint)}
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                priority
              />
            )}
          </div>

          <div
            className={cn(
              styles.tile,
              styles.b,
              'arrive-settle bg-accent [--arrive:380ms]',
            )}
          >
            <span className={cn(styles.sun, 'loop')} />
          </div>

          <div
            className={cn(
              styles.tile,
              styles.c,
              'arrive-settle bg-tint [--arrive:440ms]',
            )}
          >
            <span className={cn(styles.quarter, 'loop')} />
          </div>

          <div
            className={cn(
              styles.tile,
              styles.d,
              'arrive-settle flex flex-col justify-center gap-2.5 bg-subtle p-3 sm:p-4 [--arrive:520ms]',
            )}
          >
            {productCards.slice(0, 2).map((card, index) => (
              <ProductCard
                key={card.id}
                card={card}
                locale={locale}
                className={cn(
                  'arrive-float loop',
                  index === 0
                    ? '[--arrive:760ms] [--float-time:16s]'
                    : '[--arrive:880ms] [--float-time:20s] [--float-y:-4px]',
                )}
              />
            ))}
          </div>

          <div
            className={cn(
              styles.tile,
              styles.e,
              'arrive-settle bg-tint [--arrive:600ms]',
            )}
          >
            {secondaryPortrait?.responsiveImage && (
              <DatoImage
                fragment={secondaryPortrait.responsiveImage}
                alt=""
                layout="fill"
                objectFit="cover"
                objectPosition={focus(secondaryPortrait.focalPoint)}
                sizes="(min-width: 1024px) 180px, 25vw"
                priority
              />
            )}
          </div>

          <div
            className={cn(
              styles.tile,
              styles.f,
              'arrive-settle bg-ink [--arrive:660ms]',
            )}
          >
            <span className={cn(styles.orbit, 'loop')}>
              <span className={styles.moon} />
            </span>
          </div>

          <div
            className={cn(
              styles.tile,
              styles.g,
              'arrive-settle flex flex-col justify-between bg-accent-soft p-4 [--arrive:720ms]',
            )}
          >
            <span className={styles.ring} />
            {highlight && (
              <span className="relative flex items-center gap-2 font-semibold text-[0.875rem] text-accent-ink leading-tight">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
                  <svg
                    viewBox="0 0 12 12"
                    className="size-3"
                    aria-hidden="true"
                  >
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
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MosaicHero;
