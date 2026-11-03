import { useId } from 'react';
import { ReviewSectionFragment } from '@/components/sections/ReviewSection/fragment';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import ReviewCell from './ReviewCell';

type Props = {
  fragment: FragmentOf<typeof ReviewSectionFragment>;
  locale: string;
  /** Use h1 when this section opens a page without a hero */
  as?: 'h1' | 'h2';
};

/**
 * One review reads at a measure; two or four split in half; three or more go
 * three across from 1024 and two across at tablet width, where an odd last
 * cell spans the row. A partial last row at 1024+ stays white (`cells`).
 */
const gridClasses = (count: number) => {
  if (count === 1) return 'max-w-[720px]';
  if (count === 2 || count === 4) return 'md:grid-cols-2';
  return 'md:grid-cols-2 lg:grid-cols-3 md:max-lg:[&>li:last-child:nth-child(odd)]:col-span-2';
};

/** `minimal_cards`: quiet, editorial review cells joined by hairlines */
const MinimalReviewCards = ({ fragment, locale, as = 'h2' }: Props) => {
  const headingId = useId();
  const {
    reviews,
    reviewSectionHeader: header,
    reviewSectionSubheader: subheader,
  } = readFragment(ReviewSectionFragment, fragment);

  if (!reviews?.length) return null;

  return (
    <section
      className="section"
      aria-labelledby={header ? headingId : undefined}
      aria-label={header ? undefined : uiString(locale, 'testimonials')}
    >
      <div className="container-page">
        <SectionTitle
          title={header}
          paragraph={subheader}
          as={as}
          h1Size="section"
          align="split"
          id={headingId}
        />

        <ul className={cn('cells reveal', gridClasses(reviews.length))}>
          {reviews.map((review) => (
            <li key={review.id}>
              <ReviewCell fragment={review} locale={locale} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default MinimalReviewCards;
