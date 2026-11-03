import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { TestimonialFragment } from '@/components/sections/ReviewSection/fragment';
import ReviewerByline from '@/components/sections/ReviewSection/ReviewerByline';
import { clampRating } from '@/components/sections/ReviewSection/rating';
import SpokenRating from '@/components/sections/ReviewSection/SpokenRating';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';

type Props = {
  fragment: FragmentOf<typeof TestimonialFragment>;
  locale: string;
};

/** One centred display quote and its author; the stage wraps it in its slide */
const CenteredQuote = ({ fragment, locale }: Props) => {
  const { rating, reviewerName, review, reviewerTitle } = readFragment(
    TestimonialFragment,
    fragment,
  );

  return (
    <figure>
      <SpokenRating value={clampRating(rating)} locale={locale} />
      <blockquote className="font-display text-quote text-ink max-md:leading-[1.4] [&_p]:text-balance [&_p+p]:mt-3">
        <DatoStructuredText data={review} />
      </blockquote>
      <figcaption className="mt-6 grid justify-items-center gap-px">
        <ReviewerByline name={reviewerName} title={reviewerTitle} />
      </figcaption>
    </figure>
  );
};

export default CenteredQuote;
