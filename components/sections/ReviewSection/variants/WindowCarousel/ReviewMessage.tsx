import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { TestimonialFragment } from '@/components/sections/ReviewSection/fragment';
import ReviewerAvatar from '@/components/sections/ReviewSection/ReviewerAvatar';
import ReviewerByline from '@/components/sections/ReviewSection/ReviewerByline';
import { clampRating } from '@/components/sections/ReviewSection/rating';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import RatingStars from './RatingStars';

type Props = {
  fragment: FragmentOf<typeof TestimonialFragment>;
  locale: string;
};

/** One open message in the review window: stars, the quote and its author */
const ReviewMessage = ({ fragment, locale }: Props) => {
  const { rating, reviewerName, reviewerPicture, review, reviewerTitle } =
    readFragment(TestimonialFragment, fragment);
  const stars = clampRating(rating);

  return (
    <figure>
      <RatingStars value={stars} locale={locale} />
      <blockquote
        className={cn(
          'font-display text-[22px] leading-[1.4] tracking-[-0.01em] text-ink max-md:text-[18px] max-md:leading-[1.45] [&_p+p]:mt-3',
          stars > 0 && 'mt-4',
        )}
      >
        <DatoStructuredText data={review} />
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <ReviewerAvatar
          image={reviewerPicture?.responsiveImage}
          name={reviewerName}
          size={40}
          className="size-10"
        />
        <span className="grid min-w-0 gap-px">
          <ReviewerByline name={reviewerName} title={reviewerTitle} />
        </span>
      </figcaption>
    </figure>
  );
};

export default ReviewMessage;
