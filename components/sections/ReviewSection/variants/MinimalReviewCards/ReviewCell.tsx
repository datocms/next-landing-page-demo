import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { TestimonialFragment } from '@/components/sections/ReviewSection/fragment';
import {
  leadInkRules,
  withLeadSentence,
} from '@/components/sections/ReviewSection/leadSentence';
import ReviewerAvatar from '@/components/sections/ReviewSection/ReviewerAvatar';
import { clampRating } from '@/components/sections/ReviewSection/rating';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import RatingChip from './RatingChip';

type Props = {
  fragment: FragmentOf<typeof TestimonialFragment>;
  locale: string;
};

/**
 * One hairline cell: the reviewer and a mono "5.0" chip on top, then the
 * quote in two tones (first sentence in ink).
 */
const ReviewCell = ({ fragment, locale }: Props) => {
  const { rating, reviewerName, reviewerPicture, review, reviewerTitle } =
    readFragment(TestimonialFragment, fragment);

  return (
    <figure className="flex h-full flex-col gap-5 p-7 max-lg:p-6 max-md:p-5">
      <figcaption className="flex items-center gap-3">
        <ReviewerAvatar
          image={reviewerPicture?.responsiveImage}
          name={reviewerName}
          size={36}
          shape="square"
          className="size-9"
        />
        <span className="grid min-w-0 gap-[3px]">
          <span className="truncate text-[14.5px] leading-[1.2] font-medium text-ink">
            {reviewerName}
          </span>
          {reviewerTitle && (
            <span className="mono truncate">{reviewerTitle}</span>
          )}
        </span>
        <RatingChip
          value={clampRating(rating)}
          locale={locale}
          className="ms-auto"
        />
      </figcaption>

      <blockquote className="text-[17px] leading-[1.5] tracking-[-0.01em] text-ink-2 max-md:text-[16px] [&_p+p]:mt-3">
        <DatoStructuredText
          data={withLeadSentence(review)}
          customMarkRules={leadInkRules}
        />
      </blockquote>
    </figure>
  );
};

export default ReviewCell;
