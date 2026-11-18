import { stripStega } from '@datocms/content-link';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import { ReviewSectionFragment } from './fragment';
import ReviewCards from './variants/ReviewCards';
import ReviewList from './variants/ReviewList';
import ReviewSpotlight from './variants/ReviewSpotlight';
import ReviewWall from './variants/ReviewWall';

type Props = {
  fragment: FragmentOf<typeof ReviewSectionFragment>;
  locale: string;
};

export type ReviewLayout = 'cards' | 'spotlight' | 'list' | 'wall';

/** The layout a reviews block renders: its "Layout" value, `cards` for anything unknown */
const reviewLayout = (value?: string | null): ReviewLayout => {
  const layout = stripStega(value ?? '').trim();
  return layout === 'spotlight' || layout === 'list' || layout === 'wall'
    ? layout
    : 'cards';
};

/**
 * The reviews block in the layout picked in "Layout", or nothing without
 * reviews. Each layout sits on its own ground: `list` (the statement page's)
 * on the deep accent panel with faint arch outlines, `spotlight` (the mosaic
 * page's) straight on the page, the others on the tinted band. The wall spans
 * the band, outside the page container
 */
const ReviewSection = ({ fragment, locale }: Props) => {
  const { layout: layoutValue, testimonials: reviews } = readFragment(
    ReviewSectionFragment,
    fragment,
  );
  if (reviews.length === 0) return null;

  const layout = reviewLayout(layoutValue);

  return (
    <section
      className={cn(
        layout === 'list' &&
          'on-ink panel relative isolate overflow-hidden bg-(--accent-deep) py-20 text-on-accent sm:py-24 lg:py-28',
        layout === 'spotlight' && 'section',
        (layout === 'cards' || layout === 'wall') &&
          'band pt-16 pb-[72px] sm:pt-20 sm:pb-24 lg:pt-[104px] lg:pb-28',
      )}
      aria-label={uiString(locale, 'testimonials')}
    >
      {layout === 'list' && (
        // The statement hero's faint arch outlines, rising from the panel's bottom edge
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[88%] w-[min(64rem,150%)] -translate-x-1/2 rounded-t-full border border-[rgb(255_255_255/0.09)] border-b-0"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[70%] w-[min(46rem,120%)] -translate-x-1/2 rounded-t-full border border-[rgb(255_255_255/0.14)] border-b-0"
          />
        </>
      )}
      <div className="container-page">
        {layout === 'spotlight' && (
          <ReviewSpotlight reviews={reviews} locale={locale} />
        )}
        {layout === 'list' && <ReviewList reviews={reviews} locale={locale} />}
        {layout === 'cards' && (
          <ReviewCards reviews={reviews} locale={locale} />
        )}
      </div>
      {layout === 'wall' && <ReviewWall reviews={reviews} locale={locale} />}
    </section>
  );
};

export default ReviewSection;
