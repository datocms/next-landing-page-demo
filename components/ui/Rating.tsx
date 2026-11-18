import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import { StarIcon } from './icons';

type Props = {
  /** The rating; fractions round to the nearest whole */
  value: number;
  max?: number;
  locale: string;
  /** light: white stars, for an accent or navy fill */
  tone?: 'default' | 'light';
  /** Content Link target in Draft Mode: the record's rating field */
  editUrl?: string;
  /** Placement only */
  className?: string;
};

/** A rating as a row of stars, with the value in words for screen readers ("5 out of 5") */
const Rating = ({
  value,
  max = 5,
  locale,
  tone = 'default',
  editUrl,
  className,
}: Props) => {
  const filled = Math.max(0, Math.min(max, Math.round(value)));

  return (
    <span
      data-datocms-content-link-url={editUrl}
      className={cn('inline-flex items-center gap-[2px]', className)}
    >
      {Array.from({ length: max }, (_, index) => (
        <StarIcon
          // biome-ignore lint/suspicious/noArrayIndexKey: a fixed row of identical stars
          key={index}
          className={cn(
            'size-[15px]',
            tone === 'light'
              ? index < filled
                ? 'text-on-accent'
                : 'text-on-accent/30'
              : index < filled
                ? 'text-star'
                : 'text-line',
          )}
        />
      ))}
      <span className="sr-only">
        {uiString(locale, 'ratingOutOf', { value: filled, max })}
      </span>
    </span>
  );
};

export default Rating;
