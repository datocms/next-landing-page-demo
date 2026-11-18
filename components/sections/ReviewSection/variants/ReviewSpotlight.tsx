import type { ReactNode } from 'react';
import DatoImage from '@/components/datocms/DatoImage';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import Rating from '@/components/ui/Rating';
import { cn } from '@/utils/cn';
import ReviewPerson from '../ReviewPerson';
import { type Reviews, readTestimonial } from '../testimonial';

type Review = Reviews[number];

/** One quote on a tile in one of the mosaic's fills: stars, the quote, the person */
const QuoteTile = ({
  review,
  locale,
  fill = 'subtle',
  large = false,
  className,
  children,
}: {
  review: Review;
  locale: string;
  fill?: 'subtle' | 'tint' | 'ink';
  large?: boolean;
  className?: string;
  children?: ReactNode;
}) => {
  const {
    name,
    role,
    rating,
    review: quote,
    picture,
  } = readTestimonial(review);
  const dark = fill === 'ink';

  return (
    <figure
      className={cn(
        'reveal flex flex-col rounded-card p-6 sm:p-8',
        large && 'lg:p-12',
        fill === 'ink' && 'on-ink bg-ink text-surface',
        fill === 'tint' && 'bg-tint text-fg',
        fill === 'subtle' && 'bg-subtle text-fg',
        className,
      )}
    >
      {rating ? (
        <Rating
          value={rating}
          locale={locale}
          tone={dark ? 'light' : 'default'}
        />
      ) : null}
      <blockquote
        className={cn(
          'flex-1 font-medium [&_p+p]:mt-3',
          large
            ? 'text-balance text-[clamp(1.375rem,2.4vw,1.875rem)] leading-[1.3] tracking-[-0.03em]'
            : 'text-[1.0625rem] leading-[1.45] tracking-[-0.015em]',
          rating && (large ? 'mt-6' : 'mt-4'),
        )}
      >
        <DatoStructuredText data={quote} />
      </blockquote>
      {children ?? (
        <figcaption className="pt-7">
          {dark ? (
            <div className="leading-[1.35]">
              <p className="font-semibold text-[0.90625rem]">{name}</p>
              {role && (
                <p className="text-[0.84375rem] text-surface/70">{role}</p>
              )}
            </div>
          ) : (
            <ReviewPerson
              image={picture?.responsiveImage}
              name={name}
              role={role}
            />
          )}
        </figcaption>
      )}
    </figure>
  );
};

/**
 * `spotlight` (the mosaic page's look), straight on the page: the reviews as
 * a mosaic on the hero's 12px gap. The first is the spotlight, a large quote
 * on a pale tile beside its person's photograph cut as an arch, like the
 * hero's arch image; the next two stack beside them, one on navy, one pale.
 * Any more follow in a row of pale tiles. Below 1024px the tiles stack.
 */
const ReviewSpotlight = ({
  reviews,
  locale,
}: {
  reviews: Reviews;
  locale: string;
}) => {
  const [first, ...rest] = reviews;
  const side = rest.slice(0, 2);
  const more = rest.slice(2);
  const { name, role, portrait } = readTestimonial(first);
  const photo = portrait?.responsiveImage;
  const focal = portrait?.focalPoint;

  return (
    <div className="grid gap-2.5 lg:gap-3">
      <div
        className={cn(
          'grid gap-2.5 lg:gap-3',
          side.length > 0
            ? 'lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.85fr)_minmax(0,1.15fr)]'
            : 'lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.85fr)]',
        )}
      >
        <QuoteTile review={first} locale={locale} large fill="tint">
          <figcaption className="pt-10 leading-[1.35]">
            <p className="font-semibold text-[0.9375rem]">{name}</p>
            {role && <p className="text-[0.875rem] text-fg-muted">{role}</p>}
          </figcaption>
        </QuoteTile>
        <div
          aria-hidden="true"
          className="reveal relative min-h-[20rem] overflow-hidden rounded-t-full rounded-b-card bg-tint [--reveal-delay:80ms] max-lg:mx-auto max-lg:w-[min(18rem,70%)]"
        >
          {photo && (
            <DatoImage
              fragment={photo}
              alt=""
              layout="fill"
              objectFit="cover"
              objectPosition={
                focal ? `${focal.x * 100}% ${focal.y * 100}%` : undefined
              }
              sizes="(min-width: 1024px) 240px, 70vw"
              // A white studio backdrop takes the tile's tint, so the arch shows
              className="mix-blend-multiply"
            />
          )}
        </div>
        {side.length > 0 && (
          <div className="grid gap-2.5 lg:gap-3">
            {side.map((review, index) => (
              <QuoteTile
                key={review.id}
                review={review}
                locale={locale}
                fill={index === 0 ? 'ink' : 'subtle'}
                className="[--reveal-delay:160ms]"
              />
            ))}
          </div>
        )}
      </div>
      {more.length > 0 && (
        <div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-3 lg:gap-3">
          {more.map((review) => (
            <QuoteTile key={review.id} review={review} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSpotlight;
