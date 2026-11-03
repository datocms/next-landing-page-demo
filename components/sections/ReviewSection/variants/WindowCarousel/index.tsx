import { stripStega } from '@datocms/content-link';
import { useId } from 'react';
import {
  ReviewSectionFragment,
  TestimonialFragment,
} from '@/components/sections/ReviewSection/fragment';
import ReviewerAvatar from '@/components/sections/ReviewSection/ReviewerAvatar';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import ReviewMessage from './ReviewMessage';
import ReviewWindow from './ReviewWindow';
import WindowThreads from './WindowThreads';

type Props = {
  fragment: FragmentOf<typeof ReviewSectionFragment>;
  locale: string;
  /** Use h1 when this section opens a page without a hero */
  as?: 'h1' | 'h2';
};

/**
 * `modern_carrousel`: the review window. A small product window lists the
 * reviewers in its sidebar and opens the selected review as a message, while
 * thread bundles plug into ports on both edges (from 1200). Everything is
 * rendered here; the client window only owns the selection.
 */
const WindowCarousel = ({ fragment, locale, as = 'h2' }: Props) => {
  const headingId = useId();
  const {
    reviews,
    reviewSectionHeader: header,
    reviewSectionSubheader: subheader,
  } = readFragment(ReviewSectionFragment, fragment);

  if (!reviews?.length) return null;

  return (
    <section
      className="section overflow-x-clip"
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

        <div className="relative mx-auto max-w-[960px]">
          <WindowThreads />
          <ReviewWindow
            label={stripStega(header || '') || uiString(locale, 'testimonials')}
            items={reviews.map((review) => {
              const testimonial = readFragment(TestimonialFragment, review);
              return {
                id: review.id,
                avatar: (
                  <ReviewerAvatar
                    image={testimonial.reviewerPicture?.responsiveImage}
                    name={testimonial.reviewerName}
                    size={32}
                    className="size-8 max-md:size-7"
                  />
                ),
                name: testimonial.reviewerName,
                role: testimonial.reviewerTitle,
                message: <ReviewMessage fragment={review} locale={locale} />,
              };
            })}
          />
        </div>
      </div>
    </section>
  );
};

export default WindowCarousel;
