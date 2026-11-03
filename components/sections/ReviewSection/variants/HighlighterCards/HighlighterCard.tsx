import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { TestimonialFragment } from '@/components/sections/ReviewSection/fragment';
import {
  leadHighlightRules,
  withLeadSentence,
} from '@/components/sections/ReviewSection/leadSentence';
import ReviewerAvatar from '@/components/sections/ReviewSection/ReviewerAvatar';
import ReviewerByline from '@/components/sections/ReviewSection/ReviewerByline';
import { clampRating } from '@/components/sections/ReviewSection/rating';
import SpokenRating from '@/components/sections/ReviewSection/SpokenRating';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';

type Props = {
  fragment: FragmentOf<typeof TestimonialFragment>;
  locale: string;
};

/**
 * One highlighter card: the quote with its first sentence on the accent
 * highlighter, the reviewer at the foot. The rating is spoken, not drawn.
 */
const HighlighterCard = ({ fragment, locale }: Props) => {
  const { rating, reviewerName, reviewerPicture, review, reviewerTitle } =
    readFragment(TestimonialFragment, fragment);

  return (
    <figure className="card flex h-full flex-col gap-5 p-6 max-md:p-5">
      <SpokenRating value={clampRating(rating)} locale={locale} />

      <blockquote className="text-[16px] leading-[1.55] text-ink [&_p+p]:mt-3">
        <DatoStructuredText
          data={withLeadSentence(review)}
          customMarkRules={leadHighlightRules}
        />
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-3">
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

export default HighlighterCard;
