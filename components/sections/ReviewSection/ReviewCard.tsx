import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import Rating from '@/components/ui/Rating';
import { cn } from '@/utils/cn';
import ReviewPerson from './ReviewPerson';
import { type Reviews, readTestimonial } from './testimonial';

type Props = {
  review: Reviews[number];
  locale: string;
  className?: string;
};

/**
 * One testimonial as a white card on the tinted panel (26px radius, the soft
 * shadow, no border): accent stars, the quote, then the person at the bottom
 */
const ReviewCard = ({ review, locale, className }: Props) => {
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
        'flex h-full flex-col rounded-[26px] bg-surface p-6 shadow-soft sm:p-[30px]',
        className,
      )}
    >
      {rating ? <Rating value={rating} locale={locale} /> : null}
      <blockquote
        className={cn(
          'flex-1 font-medium text-[1.1875rem] text-fg leading-[1.42] tracking-[-0.018em] [&_p+p]:mt-3',
          rating && 'mt-[18px]',
        )}
      >
        <DatoStructuredText data={quote} />
      </blockquote>
      <figcaption className="pt-[30px]">
        <ReviewPerson
          image={picture?.responsiveImage}
          name={name}
          role={role}
        />
      </figcaption>
    </figure>
  );
};

export default ReviewCard;
