import type { CSSProperties } from 'react';
import DatoImage from '@/components/datocms/DatoImage';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import Rating from '@/components/ui/Rating';
import { cn } from '@/utils/cn';
import { type Reviews, readTestimonial } from '../testimonial';

/**
 * `list` (the statement page's look), drawn on the deep accent panel: the
 * testimonials side by side, each centred under its person's photograph cut
 * as an arch, the way the statement hero shows its images. White stars, the
 * quote in white, the name and role under it. Three across from 1024px, one
 * column below.
 */
const ReviewList = ({
  reviews,
  locale,
}: {
  reviews: Reviews;
  locale: string;
}) => (
  <ul className="grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
    {reviews.map((review, index) => {
      const {
        name,
        role,
        rating,
        review: quote,
        portrait,
      } = readTestimonial(review);
      const focal = portrait?.focalPoint;

      return (
        <li
          key={review.id}
          style={{ '--reveal-delay': `${(index % 3) * 90}ms` } as CSSProperties}
          className="reveal"
        >
          <figure className="flex h-full flex-col items-center text-center">
            <div
              aria-hidden="true"
              className="relative h-44 w-36 overflow-hidden rounded-t-full bg-[rgb(255_255_255/0.12)]"
            >
              {portrait?.responsiveImage && (
                <DatoImage
                  fragment={portrait.responsiveImage}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  objectPosition={
                    focal ? `${focal.x * 100}% ${focal.y * 100}%` : undefined
                  }
                  sizes="144px"
                />
              )}
            </div>
            {rating ? (
              <Rating
                value={rating}
                locale={locale}
                tone="light"
                className="mt-7"
              />
            ) : null}
            <blockquote
              className={cn(
                'max-w-[22rem] flex-1 text-balance font-medium text-[1.1875rem] leading-[1.42] tracking-[-0.018em] [&_p+p]:mt-3',
                rating ? 'mt-4' : 'mt-7',
              )}
            >
              <DatoStructuredText data={quote} />
            </blockquote>
            <figcaption className="mt-6 leading-[1.35]">
              <p className="font-semibold text-[0.9375rem]">{name}</p>
              {role && (
                <p className="mt-0.5 text-[0.875rem] text-on-accent/75">
                  {role}
                </p>
              )}
            </figcaption>
          </figure>
        </li>
      );
    })}
  </ul>
);

export default ReviewList;
