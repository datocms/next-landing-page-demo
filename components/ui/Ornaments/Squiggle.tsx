import { useId } from 'react';
import { cn } from '@/utils/cn';

type Props = {
  /** tone: strokes in the nearest tone-N colour (--s); sweep: the --grad-line sweep */
  variant?: 'tone' | 'sweep';
  /** Size and placement. The default 40×16 comes from the width/height attributes, so h-* / w-* override it */
  className?: string;
};

/** Three stacked wavy strokes (Stats tiles, the minimal review carousel). Decorative */
const Squiggle = ({ variant = 'tone', className }: Props) => {
  const gradientId = `sq${useId().replace(/[^\w-]/g, '')}`;
  const sweep = variant === 'sweep';

  return (
    <svg
      viewBox="0 0 40 16"
      width={40}
      height={16}
      aria-hidden="true"
      focusable="false"
      className={cn(
        'draw-in overflow-visible',
        !sweep && 'stroke-tone',
        className,
      )}
      fill="none"
      stroke={sweep ? `url(#${gradientId})` : undefined}
      strokeWidth={1.5}
      strokeLinecap="round"
    >
      <path d="M1 6C8 0 13 12 20 6S32 0 39 6" pathLength={1} />
      <path d="M1 9C8 3 13 15 20 9S32 3 39 9" pathLength={1} opacity={0.6} />
      <path d="M1 12C8 6 13 18 20 12S32 6 39 12" pathLength={1} opacity={0.3} />
      {/* After the paths, so each path keeps its sibling index (the draw-in steps) */}
      {sweep && (
        <defs>
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={0}
            x2={40}
            y2={0}
          >
            <stop offset={0} style={{ stopColor: 'var(--g-200)' }} />
            <stop offset={0.35} style={{ stopColor: 'var(--grad-b)' }} />
            <stop offset={0.68} style={{ stopColor: 'var(--grad-c)' }} />
            <stop offset={1} style={{ stopColor: 'var(--g-300)' }} />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
};

export default Squiggle;
