import type { CSSProperties } from 'react';
import { cn } from '@/utils/cn';

/**
 * Small decorative pieces of the product's interface, drawn in markup: a chart
 * line, a row of bars, a change pill. The product cards compose
 * them with the texts and figures that come from the CMS. The line, the bars
 * and the meters draw themselves once when their card arrives or reveals
 * (styles/motion.css: spark-line, spark-fill, bar, meter).
 */

/** A change such as "+12%" as a small pill: green, or grey for a drop */
export const ChangePill = ({ children }: { children: string }) => (
  <span
    className={cn(
      'inline-flex h-5 shrink-0 items-center rounded-full px-2 text-[11px] font-semibold',
      /^\s*[-−–]/.test(children)
        ? 'bg-fg/[0.07] text-fg-muted'
        : 'bg-success-soft text-success',
    )}
  >
    {children}
  </span>
);

/** A rising chart line over a faint fill of the accent */
export const Spark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 236 56"
    preserveAspectRatio="none"
    aria-hidden="true"
    className={cn('block text-accent', className ?? 'w-full')}
  >
    <path
      d="M0 44C24 46 36 32 60 36s36 10 58-2 42-18 66-12 36-12 52-14v48H0z"
      fill="currentColor"
      fillOpacity="0.12"
      className="spark-fill"
    />
    <path
      d="M0 44C24 46 36 32 60 36s36 10 58-2 42-18 66-12 36-12 52-14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      vectorEffect="non-scaling-stroke"
      pathLength={1}
      className="spark-line"
    />
  </svg>
);

/** Seven bars, the last one in the accent */
export const Bars = ({ className }: { className?: string }) => (
  <div className={cn('flex items-end gap-1.5', className)}>
    {[38, 52, 44, 66, 58, 80, 100].map((height, index, all) => (
      <span
        key={height}
        className={cn(
          'bar flex-1 rounded-t-[4px] rounded-b-[1px]',
          index === all.length - 1 ? 'bg-accent' : 'bg-accent/25',
        )}
        style={{ height: `${height}%`, '--i': index } as CSSProperties}
      />
    ))}
  </div>
);
