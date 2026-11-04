import { ArrowLeft, ArrowRight } from 'lucide-react';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import { twoDigits } from '@/utils/twoDigits';

type ArrowButtonProps = {
  onClick: () => void;
  /** id of the slides container the button changes */
  controls: string;
  locale: string;
  /** secondary (default): white, ringed; ghost: borderless, for use inside a pill */
  tone?: 'secondary' | 'ghost';
};

const arrowButtonClass = (tone: ArrowButtonProps['tone']) =>
  cn('btn btn-icon', tone === 'ghost' ? 'btn-ghost' : 'btn-secondary');

/** Shows the previous testimonial (the arrow flips in right-to-left text) */
export const PrevButton = ({
  onClick,
  controls,
  locale,
  tone = 'secondary',
}: ArrowButtonProps) => (
  <button
    type="button"
    className={arrowButtonClass(tone)}
    aria-label={uiString(locale, 'previousTestimonial')}
    aria-controls={controls}
    onClick={onClick}
  >
    <ArrowLeft
      className="rtl:-scale-x-100"
      strokeWidth={1.75}
      aria-hidden="true"
    />
  </button>
);

/** Shows the next testimonial (the arrow flips in right-to-left text) */
export const NextButton = ({
  onClick,
  controls,
  locale,
  tone = 'secondary',
}: ArrowButtonProps) => (
  <button
    type="button"
    className={arrowButtonClass(tone)}
    aria-label={uiString(locale, 'nextTestimonial')}
    aria-controls={controls}
    onClick={onClick}
  >
    <ArrowRight
      className="rtl:-scale-x-100"
      strokeWidth={1.75}
      aria-hidden="true"
    />
  </button>
);

/** "02 / 05", the current slide in ink. Visual only: each slide carries its own "n of N" label */
export const SlideCounter = ({
  index,
  count,
  className,
}: {
  index: number;
  count: number;
  className?: string;
}) => {
  const current = twoDigits(index + 1);
  const total = twoDigits(count);
  return (
    <span
      aria-hidden="true"
      className={cn('mono whitespace-nowrap', className)}
    >
      <span className="text-ink">{current}</span> / {total}
    </span>
  );
};

/**
 * Polite announcement of the new slide. Inactive slides are inert, so this is
 * what tells screen reader users that the quote changed. Empty until the
 * visitor first changes slides.
 */
export const SlideAnnouncer = ({
  index,
  count,
  name,
  enabled,
  locale,
}: {
  index: number;
  count: number;
  /** The reviewer's plain name (stega stripped) */
  name: string;
  enabled: boolean;
  locale: string;
}) => (
  <p className="sr-only" aria-live="polite" aria-atomic="true">
    {enabled
      ? uiString(locale, 'testimonialAnnouncement', {
          n: index + 1,
          total: count,
          name,
        })
      : ''}
  </p>
);
