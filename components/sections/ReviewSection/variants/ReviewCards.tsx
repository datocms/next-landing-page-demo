import { cn } from '@/utils/cn';
import ReviewCard from '../ReviewCard';
import type { Reviews } from '../testimonial';

/** Grid columns by count: three across a desktop row; on tablets two, unless that leaves one alone */
export const reviewGridClass = (count: number) =>
  count === 1
    ? 'mx-auto max-w-[36rem]'
    : count === 2
      ? 'mx-auto max-w-[52rem] md:grid-cols-2'
      : count === 3
        ? 'mx-auto max-w-[36rem] lg:max-w-none lg:grid-cols-3'
        : 'md:grid-cols-2 lg:grid-cols-3';

/** `cards`: the testimonials as white cards, three across */
const ReviewCards = ({
  reviews,
  locale,
}: {
  reviews: Reviews;
  locale: string;
}) => (
  <ul className={cn('grid gap-[18px]', reviewGridClass(reviews.length))}>
    {reviews.map((review) => (
      <li key={review.id}>
        <ReviewCard review={review} locale={locale} />
      </li>
    ))}
  </ul>
);

export default ReviewCards;
