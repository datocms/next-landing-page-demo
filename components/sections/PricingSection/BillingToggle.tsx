'use client';

import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import { type BillingPeriod, useBilling } from './BillingScope';

// Each period is also the uiString key of its label
const PERIODS: BillingPeriod[] = ['monthly', 'yearly'];

/**
 * Monthly / yearly segmented control for the nearest BillingScope. The thumb
 * slides with CSS (.segmented reads aria-pressed); without JavaScript it shows
 * monthly and stays inert.
 */
const BillingToggle = ({
  locale,
  className,
}: {
  locale: string;
  className?: string;
}) => {
  const billing = useBilling();
  const period = billing?.period ?? 'monthly';

  return (
    // biome-ignore lint/a11y/useSemanticElements: a group of toggle buttons, not a form fieldset
    <div
      role="group"
      aria-label={uiString(locale, 'billingPeriod')}
      className={cn('segmented', className)}
    >
      {PERIODS.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={period === option}
          onClick={() => billing?.setPeriod(option)}
        >
          {uiString(locale, option)}
        </button>
      ))}
    </div>
  );
};

export default BillingToggle;
