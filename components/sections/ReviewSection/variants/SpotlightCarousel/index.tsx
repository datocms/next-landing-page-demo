import { stripStega } from '@datocms/content-link';
import { useId } from 'react';
import DatoImage from '@/components/datocms/DatoImage';
import {
  ReviewSectionFragment,
  TestimonialFragment,
} from '@/components/sections/ReviewSection/fragment';
import { clampRating } from '@/components/sections/ReviewSection/rating';
import { Threads } from '@/components/ui/Ornaments';
import SectionTitle from '@/components/ui/SectionTitle';
import {
  type FragmentOf,
  type ResultOf,
  readFragment,
} from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import initialsOf from '@/utils/initialsOf';
import SpotlightQuote from './SpotlightQuote';
import SpotlightStage from './SpotlightStage';

type Props = {
  fragment: FragmentOf<typeof ReviewSectionFragment>;
  locale: string;
  /** Use h1 when this section opens a page without a hero */
  as?: 'h1' | 'h2';
};

type Testimonial = ResultOf<typeof TestimonialFragment>;

/** The reviewer's photo filling the portrait frame, or their initials on a plain tile */
const portraitOf = (testimonial: Testimonial) =>
  testimonial.reviewerPicture?.responsiveImage ? (
    <DatoImage
      key={testimonial.id}
      fragment={testimonial.reviewerPicture.responsiveImage}
      layout="fill"
      objectFit="cover"
      objectPosition="50% 30%"
      sizes="(min-width: 1024px) 232px, (min-width: 768px) 200px, 152px"
    />
  ) : (
    <span
      key={testimonial.id}
      className="grid size-full place-items-center bg-well font-display text-h2 text-ink-3"
    >
      {initialsOf(testimonial.reviewerName)}
    </span>
  );

/**
 * `card_carrousel`: the spotlight plinth. One reviewer at a time stands on
 * the hero's thread plinth (portrait plus a rating pin) beside a white card
 * with their two-tone quote, a counter, progress segments and arrows. When no
 * reviewer has a photo, the card stands alone. Everything is rendered here;
 * the client stage only owns the index.
 */
const SpotlightCarousel = ({ fragment, locale, as = 'h2' }: Props) => {
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
  const hasPortraits = testimonials.some(
    (testimonial) => testimonial.reviewerPicture?.responsiveImage,
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
          align="split"
          id={headingId}
        />

        <SpotlightStage
          slides={reviews.map((review) => ({
            id: review.id,
            node: <SpotlightQuote fragment={review} locale={locale} />,
          }))}
          portraits={hasPortraits ? testimonials.map(portraitOf) : null}
          plinth={
            hasPortraits ? (
              <Threads shape="plinth" className="opacity-85" />
            ) : null
          }
          ratings={testimonials.map((testimonial) =>
            clampRating(testimonial.rating),
          )}
          names={testimonials.map((testimonial) =>
            stripStega(testimonial.reviewerName),
          )}
          locale={locale}
        />
      </div>
    </section>
  );
};

export default SpotlightCarousel;
