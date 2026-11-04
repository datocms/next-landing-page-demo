import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import type { BillingPeriod } from './BillingPeriodProvider';

type PriceProps = {
  monthly: number;
  /** When given, the price follows the nearest BillingPeriodProvider */
  yearly?: number | null;
  locale: string;
  /** responsive: md on phones, lg from sm */
  size?: keyof typeof AMOUNT_SIZES;
  className?: string;
};

type PriceTagProps = {
  monthly?: number | null;
  yearly?: number | null;
  locale: string;
  className?: string;
};

const UNIT_KEYS = {
  monthly: { short: 'perMonthShort', spoken: 'perMonthSpoken' },
  yearly: { short: 'perYearShort', spoken: 'perYearSpoken' },
} as const satisfies Record<BillingPeriod, { short: string; spoken: string }>;

/* Inside a BillingPeriodProvider (group/billing) the yearly figures swap in with CSS only,
   so the server output is complete and monthly shows without JavaScript. The figure
   that appears fades in (pop-in); an inline PriceTag span only fades, a Price one also rises */
const MONTHLY_ONLY = 'pop-in group-data-[period=yearly]/billing:hidden';
const YEARLY_ONLY =
  'pop-in hidden group-data-[period=yearly]/billing:inline-flex';
const YEARLY_ONLY_INLINE =
  'pop-in hidden group-data-[period=yearly]/billing:inline';

const AMOUNT_SIZES = {
  lg: 'text-price',
  md: 'text-[2rem] leading-none tracking-[-0.03em] max-md:text-[1.75rem]',
  responsive: 'text-[1.75rem] leading-none tracking-[-0.03em] sm:text-price',
} as const;

/** Integers stay as they are; fractions keep two decimals */
const formatAmount = (amount: number) =>
  Number.isInteger(amount) ? String(amount) : amount.toFixed(2);

/** "/mo" or "/yr", read out as "per month" or "per year" */
const PriceUnit = ({
  period,
  locale,
  className,
}: {
  period: BillingPeriod;
  locale: string;
  className?: string;
}) => (
  <>
    <span aria-hidden="true" className={className}>
      {uiString(locale, UNIT_KEYS[period].short)}
    </span>
    <span className="sr-only">{` ${uiString(locale, UNIT_KEYS[period].spoken)}`}</span>
  </>
);

/** One figure of a Price: the amount in the display face, the unit small and muted */
const Amount = ({
  value,
  period,
  locale,
  size,
}: {
  value: number;
  period: BillingPeriod;
  locale: string;
  size: keyof typeof AMOUNT_SIZES;
}) => (
  <>
    <span className={cn('num text-ink', AMOUNT_SIZES[size])}>
      ${formatAmount(value)}
    </span>
    <PriceUnit
      period={period}
      locale={locale}
      className="text-small text-ink-3"
    />
  </>
);

/** "$40 /mo": a plan's headline price */
const Price = ({
  monthly,
  yearly,
  locale,
  size = 'lg',
  className,
}: PriceProps) => (
  <p className={cn('flex items-baseline', className)}>
    {yearly == null ? (
      <span className="inline-flex items-baseline gap-1">
        <Amount value={monthly} period="monthly" locale={locale} size={size} />
      </span>
    ) : (
      <>
        <span className={cn('inline-flex items-baseline gap-1', MONTHLY_ONLY)}>
          <Amount
            value={monthly}
            period="monthly"
            locale={locale}
            size={size}
          />
        </span>
        <span className={cn('items-baseline gap-1', YEARLY_ONLY)}>
          <Amount value={yearly} period="yearly" locale={locale} size={size} />
        </span>
      </>
    )}
  </p>
);

/**
 * Compact mono price ("$40/mo") for option chips and secondary lines. With
 * both figures it follows the nearest BillingPeriodProvider; with one it always shows it
 */
export const PriceTag = ({
  monthly,
  yearly,
  locale,
  className,
}: PriceTagProps) => (
  <span className={cn('mono', className)}>
    {monthly != null && (
      <span className={yearly != null ? MONTHLY_ONLY : undefined}>
        ${formatAmount(monthly)}
        <PriceUnit period="monthly" locale={locale} />
      </span>
    )}
    {yearly != null && (
      <span className={monthly != null ? YEARLY_ONLY_INLINE : undefined}>
        ${formatAmount(yearly)}
        <PriceUnit period="yearly" locale={locale} />
      </span>
    )}
  </span>
);

export default Price;
