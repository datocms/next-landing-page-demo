import { stripStega } from '@datocms/content-link';
import type { CSSProperties } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { CaretIcon } from '@/components/ui/icons';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import { initialsOf } from '@/utils/initialsOf';
import {
  IconCardFragment,
  ListCardFragment,
  MessageCardFragment,
  MetricFragment,
  MetricsCardFragment,
} from './fragments';
import { Bars, ChangePill, Spark } from './ProductUi';

/** A product card as the CMS returns it inside a block field */
export type ProductCardData =
  | ({ __typename: 'MetricsCardBlockRecord' } & FragmentOf<
      typeof MetricsCardFragment
    >)
  | ({ __typename: 'ListCardBlockRecord' } & FragmentOf<
      typeof ListCardFragment
    >)
  | ({ __typename: 'MessageCardBlockRecord' } & FragmentOf<
      typeof MessageCardFragment
    >)
  | ({ __typename: 'IconCardBlockRecord' } & FragmentOf<
      typeof IconCardFragment
    >);

type CardProps = {
  locale: string;
  /** Placement and width only */
  className?: string;
};

// The white card every piece sits in
const CARD =
  'rounded-tile bg-surface text-left text-[12.5px] leading-[1.45] text-fg shadow-[0_0_0_1px_rgb(9_14_52/0.06),0_30px_50px_-30px_rgb(9_14_52/0.35)]';

/** Monday to Sunday, as the locale abbreviates them: the axis under a line chart */
const weekdays = (locale: string) =>
  Array.from({ length: 7 }, (_, day) =>
    new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(2024, 0, 1 + day))),
  );

/**
 * One to three figures over a chart. A single figure is drawn large with its
 * change beside the label; several sit side by side in small boxes, over a
 * wider chart with the days of the week.
 */
export const MetricsCard = ({
  fragment,
  locale,
  className,
}: CardProps & { fragment: FragmentOf<typeof MetricsCardFragment> }) => {
  const { chart, metrics } = readFragment(MetricsCardFragment, fragment);
  const figures = metrics.map((metric) => readFragment(MetricFragment, metric));
  const kind = stripStega(chart ?? '').trim();
  if (figures.length === 0) return null;

  if (figures.length === 1) {
    const [figure] = figures;
    return (
      <div className={cn(CARD, 'overflow-hidden p-4 pb-0', className)}>
        <div className="flex items-center justify-between gap-3 font-medium text-fg-muted">
          <span className="truncate">{figure.label}</span>
          {figure.change && <ChangePill>{figure.change}</ChangePill>}
        </div>
        <div className="mt-0.5 text-[22px] leading-7 font-[650] tracking-[-0.035em] whitespace-nowrap">
          {figure.value}
        </div>
        {kind === 'bars' ? (
          <Bars className="mt-2.5 h-[52px] pb-3.5" />
        ) : kind === 'none' ? (
          <div className="pb-4" />
        ) : (
          <Spark className="-mx-4 mt-2 h-14 w-[calc(100%+2rem)]" />
        )}
      </div>
    );
  }

  return (
    <div className={cn(CARD, 'overflow-hidden p-3.5 pb-0', className)}>
      <div
        className="grid gap-2.5"
        style={{
          gridTemplateColumns: `repeat(${figures.length}, minmax(0, 1fr))`,
        }}
      >
        {figures.map((figure) => (
          <div
            key={figure.id}
            className="min-w-0 rounded-[12px] p-2.5 shadow-[inset_0_0_0_1px_var(--color-line)] sm:p-3"
          >
            <div className="truncate font-medium text-fg-muted">
              {figure.label}
            </div>
            <div className="mt-0.5 mb-1.5 text-[17px] leading-7 font-[650] tracking-[-0.035em] whitespace-nowrap sm:text-[21px]">
              {figure.value}
            </div>
            {figure.change && <ChangePill>{figure.change}</ChangePill>}
          </div>
        ))}
      </div>
      {kind === 'bars' ? (
        <Bars className="mt-4 h-[78px] pb-3.5" />
      ) : kind === 'none' ? (
        <div className="pb-3.5" />
      ) : (
        <>
          <Spark className="-mx-3.5 mt-3 h-[78px] w-[calc(100%+1.75rem)]" />
          <div className="flex justify-between px-1 pt-2 pb-3 text-[11px] text-fg-faint">
            {weekdays(locale).map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/**
 * A short list, drawn in the style the card picks: `bars` (a label, a bar and
 * a value), `funnel` (bars that get shorter row after row), `people` (initials,
 * a name and a role) or `tags` (a short code and a text). Bars are sized
 * against the largest share of the card.
 */
export const ListCard = ({
  fragment,
  className,
}: CardProps & { fragment: FragmentOf<typeof ListCardFragment> }) => {
  const { title, style, rows } = readFragment(ListCardFragment, fragment);
  const kind = stripStega(style ?? '').trim();
  if (rows.length === 0) return null;

  const largest = Math.max(1, ...rows.map((row) => row.share ?? 0));
  const heading = title && (
    <div className="mb-1 font-semibold text-fg-muted">{title}</div>
  );

  if (kind === 'funnel') {
    return (
      <div className={cn(CARD, 'p-[18px]', className)}>
        {heading}
        <div className="space-y-2">
          {rows.map((row, index) => (
            <div
              key={row.id}
              className="relative flex h-[46px] items-center justify-between gap-3 overflow-hidden rounded-[11px] bg-fg/[0.05] px-3.5 font-medium"
            >
              <span
                className="meter absolute inset-y-0 left-0 rounded-[11px] bg-accent/25"
                style={
                  {
                    width: `${((row.share ?? 0) / largest) * 100}%`,
                    '--i': index,
                  } as CSSProperties
                }
              />
              <span className="relative truncate">{row.label}</span>
              {row.value && (
                <span className="relative font-semibold">{row.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === 'people') {
    return (
      <div className={cn(CARD, 'px-[18px] py-2', className)}>
        {heading}
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center gap-2.5 border-line border-t py-2 first:border-t-0"
          >
            <span className="grid size-[26px] shrink-0 place-items-center rounded-full bg-tint text-[10px] font-semibold">
              {initialsOf(stripStega(row.label))}
            </span>
            <span className="min-w-0 flex-1 truncate font-semibold">
              {row.label}
            </span>
            {row.value && (
              <span
                className={cn(
                  'inline-flex h-[26px] shrink-0 items-center gap-1 rounded-[8px] pr-1.5 pl-2.5 font-medium',
                  row.highlighted
                    ? 'bg-accent-soft text-accent-ink shadow-[inset_0_0_0_1.5px_var(--accent)]'
                    : 'text-fg/80 shadow-[inset_0_0_0_1px_var(--color-line-strong)]',
                )}
              >
                {row.value}
                <CaretIcon className="size-3 opacity-55" />
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (kind === 'tags') {
    return (
      <div className={cn(CARD, 'px-[18px] py-2', className)}>
        {heading}
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center gap-3 border-line border-t py-2.5 text-[13.5px] first:border-t-0"
          >
            <span
              className={cn(
                'grid h-[22px] min-w-[34px] shrink-0 place-items-center rounded-[6px] px-1.5 text-[10.5px] font-bold uppercase',
                row.highlighted
                  ? 'bg-accent text-on-accent'
                  : 'bg-fg/[0.06] text-fg-muted',
              )}
            >
              {row.label}
            </span>
            {row.value && (
              <span
                className={cn(
                  'min-w-0 truncate',
                  row.highlighted ? 'font-semibold' : 'text-fg-muted',
                )}
              >
                {row.value}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn(CARD, 'px-[18px] pt-4 pb-2', className)}>
      {heading}
      {rows.map((row, index) => (
        <div
          key={row.id}
          className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 border-line border-t py-[9px] font-medium text-fg-muted first:border-t-0"
        >
          <span className="truncate">{row.label}</span>
          <span className="block h-2 rounded-full bg-fg/[0.07]">
            <span
              className="meter block h-2 rounded-full bg-accent"
              style={
                {
                  width: `${((row.share ?? 0) / largest) * 84}%`,
                  '--i': index,
                } as CSSProperties
              }
            />
          </span>
          <span className="min-w-[2.25rem] text-right text-fg">
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/** A short message, as an email would show it: a title, when it arrived, the text and a few figures */
export const MessageCard = ({
  fragment,
  className,
}: CardProps & { fragment: FragmentOf<typeof MessageCardFragment> }) => {
  const { title, timeLabel, text, metrics } = readFragment(
    MessageCardFragment,
    fragment,
  );
  const figures = metrics.map((metric) => readFragment(MetricFragment, metric));

  return (
    <div className={cn(CARD, 'p-[18px]', className)}>
      <div className="flex items-center gap-2.5">
        <span className="grid size-7 shrink-0 place-items-center rounded-[9px] bg-accent">
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
            <path
              d="M3 11.2 6.4 7.8l2.6 2.6L13 5.2"
              fill="none"
              stroke="var(--on-accent)"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="min-w-0">
          <span className="block truncate font-semibold">{title}</span>
          {timeLabel && (
            <span className="block text-[11.5px] text-fg-faint">
              {timeLabel}
            </span>
          )}
        </span>
      </div>
      <div className="mt-3 text-[13.5px] leading-[1.55] text-fg/80 [&_p+p]:mt-2">
        <DatoStructuredText data={text} />
      </div>
      {figures.length > 0 && (
        <div
          className="mt-3.5 grid gap-2 border-line border-t pt-3"
          style={{
            gridTemplateColumns: `repeat(${figures.length}, minmax(0, 1fr))`,
          }}
        >
          {figures.map((figure) => (
            <span key={figure.id} className="min-w-0">
              <span className="block truncate text-[11.5px] text-fg-muted">
                {figure.label}
              </span>
              <span className="block text-[15px] font-semibold tracking-[-0.02em]">
                {figure.value}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

/** An icon on a tinted chip beside a title and an optional line: a feature said plainly */
export const IconCard = ({
  fragment,
  className,
}: CardProps & { fragment: FragmentOf<typeof IconCardFragment> }) => {
  const { title, text, icon } = readFragment(IconCardFragment, fragment);

  return (
    <div className={cn(CARD, 'flex items-center gap-3.5 p-4', className)}>
      {icon?.url && (
        <span className="grid size-11 shrink-0 place-items-center rounded-[13px] bg-accent-soft text-accent-ink">
          {/* The icon is used as a mask, so it takes the chip's colour whatever its own */}
          <span
            className="size-[22px] bg-current"
            style={{
              mask: `url("${icon.url}") center / contain no-repeat`,
              WebkitMask: `url("${icon.url}") center / contain no-repeat`,
            }}
          />
        </span>
      )}
      <span className="min-w-0">
        <span className="block text-[14px] leading-5 font-semibold tracking-[-0.01em]">
          {title}
        </span>
        {text && <span className="mt-0.5 block text-fg-muted">{text}</span>}
      </span>
    </div>
  );
};

/**
 * A small piece of the product drawn in markup from a product card block.
 * Decorative (sample figures): the caller hides it from assistive technology.
 */
const ProductCard = ({
  card,
  locale,
  className,
}: CardProps & { card: ProductCardData }) => {
  switch (card.__typename) {
    case 'MetricsCardBlockRecord':
      return (
        <MetricsCard fragment={card} locale={locale} className={className} />
      );
    case 'ListCardBlockRecord':
      return <ListCard fragment={card} locale={locale} className={className} />;
    case 'MessageCardBlockRecord':
      return (
        <MessageCard fragment={card} locale={locale} className={className} />
      );
    case 'IconCardBlockRecord':
      return <IconCard fragment={card} locale={locale} className={className} />;
    default:
      return null;
  }
};

export default ProductCard;
