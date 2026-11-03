import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { TestimonialFragment } from '@/components/sections/ReviewSection/fragment';
import {
  leadInkRules,
  withLeadSentence,
} from '@/components/sections/ReviewSection/leadSentence';
import ReviewerByline from '@/components/sections/ReviewSection/ReviewerByline';
import { clampRating } from '@/components/sections/ReviewSection/rating';
import SpokenRating from '@/components/sections/ReviewSection/SpokenRating';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';

type Props = {
  fragment: FragmentOf<typeof TestimonialFragment>;
  locale: string;
};

/**
 * One spotlight quote: a two-tone display quote (the first sentence in ink)
 * with the reviewer's name right under it. The stage wraps it in its slide
 * and keeps the controls at the bottom of the card.
 */
const SpotlightQuote = ({ fragment, locale }: Props) => {
  const { rating, reviewerName, review, reviewerTitle } = readFragment(
    TestimonialFragment,
    fragment,
  );

  return (
    <figure>
      <SpokenRating value={clampRating(rating)} locale={locale} />
      <blockquote className="max-w-[560px] font-display text-quote text-ink-2 max-md:leading-[1.4] [&_p+p]:mt-3">
        <DatoStructuredText
          data={withLeadSentence(review)}
          customMarkRules={leadInkRules}
        />
      </blockquote>
      <figcaption className="mt-6 grid gap-px">
        <ReviewerByline name={reviewerName} title={reviewerTitle} />
      </figcaption>
    </figure>
  );
};

export default SpotlightQuote;
