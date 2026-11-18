import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import Button from '@/components/ui/Button';
import { CheckIcon, DashIcon } from '@/components/ui/icons';
import { fieldEditUrl } from '@/lib/datocms/contentLink';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import { hasStructuredText } from '@/utils/structuredText';
import type { Plan } from './fragment';
import { type FeatureRow, formatPrice } from './plans';

/** default: on white. accent: on the featured plan's accent fill (white text, muted white) */
export type PlanTone = 'default' | 'accent';

/** Secondary text by tone: the muted navy, or white at about 84% on the accent fill */
export const MUTED: Record<PlanTone, string> = {
  default: 'text-fg-muted',
  accent: 'text-on-accent/85',
};

type PriceProps = {
  monthly: number;
  /** The plan's name: in Draft Mode each figure opens its price field (Content Link) */
  source?: string;
  /** When set, the price follows the nearest BillingScope */
  yearly?: number | null;
  locale: string;
  tone?: PlanTone;
  /** lg: the cards' and tabs' 54px figure. md: 40px, for the table's narrower column */
  size?: PriceSize;
  className?: string;
};

type PriceSize = 'md' | 'lg';

const FIGURE: Record<PriceSize, string> = {
  lg: 'text-[clamp(2.75rem,4.6vw,3.375rem)]',
  md: 'text-[2.5rem]',
};

/** One figure with its period: "$399" large and tight, "per month" small and muted beside it */
const Figure = ({
  amount,
  period,
  locale,
  tone,
  size,
  swaps = false,
  source,
  className,
}: {
  amount: number;
  source?: string;
  period: 'perMonth' | 'perYear';
  /** The plan has both prices, so this figure trades places with the other one */
  swaps?: boolean;
  locale: string;
  tone: PlanTone;
  size: PriceSize;
  className?: string;
}) => (
  <span
    data-datocms-content-link-url={fieldEditUrl(
      source,
      period === 'perYear' ? 'yearly_price' : 'monthly_price',
    )}
    // styles/motion.css: the figure that leaves lifts out, the one that arrives rises in
    data-price={
      swaps ? (period === 'perYear' ? 'yearly' : 'monthly') : undefined
    }
    className={cn(
      'flex flex-wrap items-baseline gap-x-1.5 [grid-area:1/1]',
      className,
    )}
  >
    <span
      className={cn(
        'font-semibold tabular-nums leading-none tracking-[-0.055em]',
        FIGURE[size],
      )}
    >
      {formatPrice(amount, locale)}
    </span>
    <span className={cn('text-[0.90625rem]', MUTED[tone])}>
      {uiString(locale, period)}
    </span>
  </span>
);

/**
 * A plan's price. Both figures share one grid cell and the hidden one keeps
 * its space, so switching the period never moves anything around it: the two
 * figures trade places with a short roll (off under reduced motion).
 */
export const Price = ({
  monthly,
  yearly,
  locale,
  tone = 'default',
  size = 'lg',
  source,
  className,
}: PriceProps) => (
  <p className={cn('grid', className)}>
    <Figure
      amount={monthly}
      period="perMonth"
      source={source}
      locale={locale}
      tone={tone}
      size={size}
      swaps={yearly != null}
      className={
        yearly != null
          ? 'group-data-[period=yearly]/billing:invisible'
          : undefined
      }
    />
    {yearly != null && (
      <Figure
        amount={yearly}
        period="perYear"
        source={source}
        locale={locale}
        tone={tone}
        size={size}
        swaps
        className="invisible group-data-[period=yearly]/billing:visible"
      />
    )}
  </p>
);

/** A plan's description from the CMS, in muted text */
export const PlanDescription = ({
  plan,
  tone = 'default',
  className,
}: {
  plan: Plan;
  tone?: PlanTone;
  className?: string;
}) =>
  hasStructuredText(plan.description) ? (
    <div className={cn(MUTED[tone], '[&_p+p]:mt-2', className)}>
      <DatoStructuredText data={plan.description} />
    </div>
  ) : null;

/**
 * The plan's call to action: its CMS label, the generic one without. A pill:
 * the accent fill when primary, otherwise white with a hairline (also on the
 * featured card's accent fill, where it reads as a white pill with navy text)
 */
export const PlanButton = ({
  plan,
  primary,
  locale,
  size = 'md',
  variant,
  className,
}: {
  plan: Plan;
  primary: boolean;
  locale: string;
  size?: 'md' | 'lg';
  /** Overrides the pill: light for a white pill on the accent fill */
  variant?: 'primary' | 'secondary' | 'light';
  className?: string;
}) => (
  <Button
    variant={variant ?? (primary ? 'primary' : 'secondary')}
    size={size}
    className={className}
  >
    {plan.ctaLabel || uiString(locale, 'choosePlan')}
  </Button>
);

/**
 * A plan's features: an accent check for what it includes; what only richer
 * plans have is muted behind a dash (and announced as not included).
 */
export const FeatureList = ({
  rows,
  locale,
  columns = false,
  tone = 'default',
  className,
}: {
  rows: FeatureRow[];
  locale: string;
  tone?: PlanTone;
  /**
   * Flow the list into CSS columns that fill top to bottom, so the included
   * features come first in reading order and the dashed ones last. The caller
   * sets the column counts (`sm:columns-2`…)
   */
  columns?: boolean;
  className?: string;
}) =>
  rows.length > 0 ? (
    <ul
      className={cn(
        columns
          ? 'gap-x-8 [&>li+li]:mt-3 [&>li]:break-inside-avoid'
          : 'grid content-start gap-y-[13px]',
        className,
      )}
    >
      {rows.map((row) => (
        <li
          key={row.key}
          data-datocms-content-link-url={row.editUrl}
          className={cn('flex gap-2.5', !row.included && MUTED[tone])}
        >
          <span
            aria-hidden="true"
            className="flex h-[1lh] w-4 shrink-0 items-center"
          >
            {row.included ? (
              <CheckIcon
                className={cn(
                  'size-4',
                  tone === 'accent' ? 'text-on-accent' : 'text-accent-ink',
                )}
              />
            ) : (
              <DashIcon
                className={cn(
                  'size-4',
                  tone === 'accent' ? 'text-on-accent/60' : 'text-fg-faint',
                )}
              />
            )}
          </span>
          {row.included ? (
            <span>{row.text}</span>
          ) : (
            <span>
              <span className="sr-only">{`${uiString(locale, 'notIncluded')} `}</span>
              {row.text}
            </span>
          )}
        </li>
      ))}
    </ul>
  ) : null;
