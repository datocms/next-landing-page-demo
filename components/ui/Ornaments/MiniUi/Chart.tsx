import { useId } from 'react';
import MiniGradients from './MiniGradients';
import MiniUiFrame, { type MiniUiProps } from './MiniUiFrame';

/** The data line; the area fill closes it along the baseline */
const CHART_LINE =
  'M36 142C56 142 68 130 88 132S116 146 136 142S164 108 184 110S212 118 236 96S268 84 284 86S304 70 316 64';

/** An area chart with a guide, tooltip and data point; those three are the hover part */
const Chart = ({ className }: MiniUiProps) => {
  const gradientIdPrefix = `mini${useId()}`;

  return (
    <MiniUiFrame name="chart" className={className}>
      <MiniGradients id={gradientIdPrefix} />
      <rect
        x="20.5"
        y="20.5"
        width="311"
        height="159"
        rx="12"
        className="lift fill-white stroke-line"
      />
      <rect x="36" y="36" width="64" height="8" rx="4" className="fill-sk-2" />
      <path
        d="M36 64.5H316M36 98.5H316M36 132.5H316"
        className="fill-none stroke-line"
        strokeDasharray="3 4"
      />
      <path d="M36 164.5H316" className="fill-none stroke-line" />
      <path
        d={`${CHART_LINE}L316 164L36 164Z`}
        fill={`url(#${gradientIdPrefix}-area)`}
      />
      <path
        d={CHART_LINE}
        stroke={`url(#${gradientIdPrefix}-sweep)`}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <g data-anim="">
        <path
          d="M236 30V164"
          className="fill-none stroke-line-strong"
          strokeDasharray="3 3"
        />
        <rect
          x="166.5"
          y="38.5"
          width="60"
          height="32"
          rx="8"
          className="lift fill-white stroke-line"
        />
        <rect
          x="176"
          y="47"
          width="30"
          height="6"
          rx="3"
          className="fill-sk-2"
        />
        <rect x="176" y="57" width="40" height="6" rx="3" className="fill-sk" />
        <circle cx="236" cy="96" r="10" className="fill-tone-wash" />
        <circle
          cx="236"
          cy="96"
          r="5"
          className="fill-white stroke-tone"
          strokeWidth={2.5}
        />
      </g>
    </MiniUiFrame>
  );
};

export default Chart;
