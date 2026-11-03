import { stripStega } from '@datocms/content-link';
import { useId } from 'react';
import {
  ReviewSectionFragment,
  TestimonialFragment,
} from '@/components/sections/ReviewSection/fragment';
import ReviewerAvatar from '@/components/sections/ReviewSection/ReviewerAvatar';
import { Squiggle } from '@/components/ui/Ornaments';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import CenteredQuote from './CenteredQuote';
import MinimalStage from './MinimalStage';

type Props = {
  fragment: FragmentOf<typeof ReviewSectionFragment>;
  locale: string;
  /** Use h1 when this section opens a page without a hero */
  as?: 'h1' | 'h2';
};

/**
 * `minimal_carrousel`: open and centred, no band or card. A squiggle, one
 * display quote at a time and a white avatar switcher pill. Everything is
 * rendered here; the client stage only owns the index.
 */
const MinimalCarousel = ({ fragment, locale, as = 'h2' }: Props) => {
  const headingId = useId();
  const {
    reviews,
    reviewSectionHeader: header,
    reviewSectionSubheader: subheader,
  } = readFragment(ReviewSectionFragment, fragment);

  if (!reviews?.length) return null;

  const testimonials = reviews.map((review) =>
    readFragment(TestimonialFragment, review),
  );

  return (
    <section
      className="section"
      aria-roledescription={
        reviews.length > 1 ? uiString(locale, 'carousel') : undefined
      }
      aria-labelledby={header ? headingId : undefined}
      aria-label={header ? undefined : uiString(locale, 'testimonials')}
    >
      <div className="container-page">
        <SectionTitle
          title={header}
          paragraph={subheader}
          as={as}
          h1Size="section"
          align="center"
          gap="lg"
          id={headingId}
        />

        <div className="mb-5 flex justify-center">
          <Squiggle variant="sweep" className="h-5 w-12" />
        </div>

        <MinimalStage
          slides={reviews.map((review) => ({
            id: review.id,
            node: <CenteredQuote fragment={review} locale={locale} />,
          }))}
          avatars={testimonials.map((testimonial) => (
            <ReviewerAvatar
              key={testimonial.id}
              image={testimonial.reviewerPicture?.responsiveImage}
              name={testimonial.reviewerName}
              size={32}
              className="size-8"
            />
          ))}
          names={testimonials.map((testimonial) =>
            stripStega(testimonial.reviewerName),
          )}
          locale={locale}
        />
      </div>
    </section>
  );
};

export default MinimalCarousel;
