import { useId } from 'react';
import { cn } from '@/utils/cn';
import SkeletonBar from './SkeletonBar';

type Props = {
  /** Below 768 the window shows only the media panel, when there is one */
  hideOnMobile: boolean;
};

/** The chart's main series, on a 440×150 viewBox; it also outlines the area fill under it */
const SERIES_PATH =
  'M0 118 C 20 118, 24 110, 40 112 S 64 122, 80 120 S 104 98, 120 96 S 148 104, 160 102 S 184 82, 200 80 S 228 88, 240 86 S 266 60, 280 58 S 306 68, 320 66 S 346 42, 360 40 S 388 50, 400 48 S 428 28, 440 26';

/**
 * The product window's wordless chart card: a head with a value and a legend,
 * then an accent line chart with a dashed comparison series and a hovered
 * point (guide, marker and tooltip). Decorative.
 */
const ChartPanel = ({ hideOnMobile }: Props) => {
  // Prefix for the gradients' ids: url(#…) needs an id without the punctuation React ids carry
  const idPrefix = `win${useId().replace(/[^\w-]/g, '')}`;

  return (
    <div
      aria-hidden="true"
      className={cn(
        'rounded-panel border border-line bg-white px-4 pt-4 pb-3',
        hideOnMobile && 'max-md:hidden',
      )}
    >
      <div className="flex items-start justify-between">
        <span className="grid gap-2">
          <SkeletonBar className="bg-sk-2" width="64px" />
          <i className="block h-3.5 w-24 rounded-[5px] bg-[color-mix(in_oklch,var(--ink)_26%,white)]" />
        </span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <i className="size-2 rounded-full bg-accent" />
            <SkeletonBar className="bg-sk" width="36px" />
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2 rounded-full bg-g-300" />
            <SkeletonBar className="bg-sk" width="28px" />
          </span>
        </span>
      </div>
      <svg
        viewBox="0 0 440 150"
        className="mt-2.5 h-auto w-full overflow-visible"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={`${idPrefix}-sweep`} x1={0} y1={0} x2={1} y2={0}>
            <stop offset={0} style={{ stopColor: 'var(--g-300)' }} />
            <stop offset={0.55} style={{ stopColor: 'var(--grad-b)' }} />
            <stop offset={1} style={{ stopColor: 'var(--grad-c)' }} />
          </linearGradient>
          <linearGradient id={`${idPrefix}-area`} x1={0} y1={0} x2={0} y2={1}>
            <stop offset={0} style={{ stopColor: 'var(--g-200)' }} />
            <stop
              offset={1}
              style={{ stopColor: 'var(--g-50)', stopOpacity: 0 }}
            />
          </linearGradient>
        </defs>
        {/* Gridlines */}
        <path
          d="M0 10.5H440M0 50.5H440M0 90.5H440M0 130.5H440"
          className="fill-none stroke-line"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={`${SERIES_PATH} L 440 130 L 0 130 Z`}
          fill={`url(#${idPrefix}-area)`}
        />
        {/* The comparison series */}
        <path
          d="M0 124 C 30 124, 50 120, 80 121 S 130 112, 160 113 S 210 106, 240 104 S 300 98, 330 92 S 400 86, 440 80"
          className="fill-none stroke-g-300"
          strokeWidth={1.25}
          strokeDasharray="3 4"
          strokeLinecap="round"
        />
        <path
          d={SERIES_PATH}
          stroke={`url(#${idPrefix}-sweep)`}
          className="fill-none"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* The hovered point at x 280: guide line, halo, marker and tooltip */}
        <path
          d="M280 4V130"
          className="fill-none stroke-line-strong opacity-60"
          strokeDasharray="3 3"
        />
        <circle
          cx={280}
          cy={58}
          r={10}
          className="fill-[color-mix(in_oklch,var(--accent-solid)_16%,transparent)]"
        />
        <circle
          cx={280}
          cy={58}
          r={4}
          className="fill-accent stroke-white"
          strokeWidth={2}
        />
        <rect
          x={292.5}
          y={12.5}
          width={72}
          height={28}
          rx={6}
          className="fill-white stroke-line"
        />
        <circle cx={304} cy={26.5} r={3} className="fill-accent" />
        <rect
          x={312}
          y={23.5}
          width={40}
          height={6}
          rx={3}
          className="fill-sk-3"
        />
      </svg>
    </div>
  );
};

export default ChartPanel;
