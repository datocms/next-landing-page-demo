import { Star } from 'lucide-react';
import SpokenRating from '@/components/sections/ReviewSection/SpokenRating';
import { cn } from '@/utils/cn';

type Props = {
  /** Whole stars, from clampRating */
  value: number;
  locale: string;
};

const STAR_KEYS = ['s1', 's2', 's3', 's4', 's5'] as const;

/** A row of five stars, the first `value` of them in the accent. Nothing for 0 */
const RatingStars = ({ value, locale }: Props) =>
  value > 0 ? (
    <>
      <span aria-hidden="true" className="flex gap-0.5">
        {STAR_KEYS.map((key, i) => (
          <Star
            key={key}
            strokeWidth={1.75}
            className={cn(
              'size-3.5 fill-current',
              i < value ? 'text-accent-solid' : 'text-line',
            )}
          />
        ))}
      </span>
      <SpokenRating value={value} locale={locale} />
    </>
  ) : null;

export default RatingStars;
