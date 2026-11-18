import type { CSSProperties } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import Rating from '@/components/ui/Rating';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import ReviewPerson from '../ReviewPerson';
import { type Reviews, readTestimonial } from '../testimonial';
import styles from './ReviewWall.module.css';
import WallWindow from './WallWindow';

/** Columns in one tile of the plane; the plane is two tiles side by side */
const COLUMNS = 5;
/** A column's run holds the testimonials, repeated until it has at least this many cards */
const MIN_RUN = 6;
/** Cards hung under a run so the window stays full until the loop restarts */
const TAIL = 5;
/** Each column's upward offset, in --stagger units */
const OFFSETS = [0, 9, 4, 13, 6];
/** Vertical drift: seconds per card in a run (about 18px a second) */
const SECONDS_PER_CARD = 14;

type Slot = { index: number; real: boolean };

/**
 * The plane's columns. Every column holds all the testimonials in the same cyclic
 * order, each starting further along, so all columns are exactly as tall. Each
 * testimonial is real (in the accessibility tree) once: in the first tile, in column
 * `floor(i × COLUMNS / count)`, which starts at the first testimonial it owns, so the
 * real ones read in the CMS order. Everything else is a copy.
 */
const planColumns = (count: number) => {
  const run = count * Math.ceil(MIN_RUN / count);
  return Array.from({ length: COLUMNS * 2 }, (_, column) => {
    const tileColumn = column % COLUMNS;
    const start = Math.ceil((tileColumn * count) / COLUMNS) % count;
    const slots: Slot[] = Array.from({ length: run }, (_, position) => {
      const index = (start + position) % count;
      return {
        index,
        real:
          column < COLUMNS &&
          position < count &&
          Math.floor((index * COLUMNS) / count) === tileColumn,
      };
    });
    const tail = Array.from(
      { length: TAIL },
      (_, position) => (start + position) % count,
    );
    return { tileColumn, slots, tail };
  });
};

/** One testimonial on the wall: a compact white card */
const WallCard = ({
  review,
  locale,
}: {
  review: Reviews[number];
  locale: string;
}) => {
  const {
    name,
    role,
    rating,
    review: quote,
    picture,
  } = readTestimonial(review);

  return (
    <figure
      className={cn(
        styles.card,
        'flex flex-col rounded-card bg-surface p-[22px] shadow-soft sm:p-6',
      )}
    >
      {rating ? <Rating value={rating} locale={locale} /> : null}
      <blockquote
        className={cn(
          'font-medium text-[0.96875rem] text-fg leading-[1.48] tracking-[-0.012em] sm:text-[1.03125rem] [&_p+p]:mt-2.5',
          rating && 'mt-3.5',
        )}
      >
        <DatoStructuredText data={quote} />
      </blockquote>
      <figcaption className="pt-5">
        <ReviewPerson
          image={picture?.responsiveImage}
          name={name}
          role={role}
          avatarSize={32}
        />
      </figcaption>
    </figure>
  );
};

/** A copy made to fill the plane: hidden from assistive tech and never focusable */
const Copy = ({
  review,
  locale,
}: {
  review: Reviews[number];
  locale: string;
}) => (
  <div className={styles.slot} aria-hidden="true" inert>
    <WallCard review={review} locale={locale} />
  </div>
);

/**
 * `wall`: a window across the panel onto a plane of white cards in staggered columns
 * that drifts slowly on both axes, in a seamless loop. Pointer or focus pauses it and
 * grows the card under it; click and drag moves it around. Still under reduced motion,
 * where dragging still moves it.
 */
const ReviewWall = ({
  reviews,
  locale,
}: {
  reviews: Reviews;
  locale: string;
}) => {
  const columns = planColumns(reviews.length);
  const run = columns[0].slots.length;

  return (
    <WallWindow
      className={cn(styles.window, 'mx-4 sm:mx-6')}
      label={uiString(locale, 'testimonials')}
    >
      <div className={styles.mask}>
        <div className={styles.driftX} data-drift="x">
          <div
            className={styles.driftY}
            data-drift="y"
            style={
              {
                '--wall-y-duration': `${run * SECONDS_PER_CARD}s`,
              } as CSSProperties
            }
          >
            {columns.map(({ tileColumn, slots, tail }, column) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: a fixed layout of columns
                key={column}
                className={styles.column}
                style={{ '--offset': OFFSETS[tileColumn] } as CSSProperties}
                {...(column >= COLUMNS
                  ? { 'aria-hidden': true, inert: true }
                  : {})}
              >
                {slots.map(({ index, real }, position) =>
                  real ? (
                    <div key={reviews[index].id} className={styles.slot}>
                      <WallCard review={reviews[index]} locale={locale} />
                    </div>
                  ) : (
                    <Copy
                      // biome-ignore lint/suspicious/noArrayIndexKey: copies repeat the same review
                      key={position}
                      review={reviews[index]}
                      locale={locale}
                    />
                  ),
                )}
                <div className={styles.tail} aria-hidden="true" inert>
                  {tail.map((index, position) => (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: copies repeat the same review
                      key={position}
                      className={styles.slot}
                    >
                      <WallCard review={reviews[index]} locale={locale} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WallWindow>
  );
};

export default ReviewWall;
