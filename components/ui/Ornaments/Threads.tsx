import { type CSSProperties, useId } from 'react';
import { cn } from '@/utils/cn';
import {
  type GradientStop,
  roundToHundredths,
  type ShapeDef,
  THREAD_PRESETS,
  type ThreadPreset,
} from './threadShapes';

type Props = {
  /** A preset name, or a group-local ShapeDef (keep it on the server side of client islands) */
  shape: ThreadPreset | ShapeDef;
  /** Draw the strokes once on load, or scrubbed by scroll (static under reduced motion) */
  draw?: 'load' | 'view';
  /** Overrides the shape's preserveAspectRatio */
  aspect?: string;
  /** Placement: utilities beat .threads (left-auto w-[52%], hidden lg:block, opacity-85…) */
  className?: string;
  /** Extra custom properties, for example { '--draw-delay': '700ms' } */
  style?: CSSProperties & Record<`--${string}`, string | number>;
};

/** A shape resolved into its SVG paths and their gradients */
type ThreadGeometry = {
  width: number;
  height: number;
  paths: {
    key: string;
    d: string;
    /** The path's gradient line, in viewBox units */
    line: [x1: number, y1: number, x2: number, y2: number];
    stops: { key: string; offset: number; color: string }[];
  }[];
};

/** The accent ramp a thread's depth (0 light → 1 deep) is mixed from */
const DEPTH_RAMP: [depth: number, color: string][] = [
  [0, 'var(--g-200)'],
  [0.3, 'var(--grad-a)'],
  [0.62, 'var(--grad-b)'],
  [1, 'var(--grad-c)'],
];

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

/** The ramp colour at a depth: a ramp colour, or a color-mix() of the two around it */
function colorAtDepth(depth: number) {
  const clampedDepth = clamp01(depth);
  let upper = 1;
  while (upper < DEPTH_RAMP.length - 1 && clampedDepth > DEPTH_RAMP[upper][0]) {
    upper++;
  }
  const [fromDepth, fromColor] = DEPTH_RAMP[upper - 1];
  const [toDepth, toColor] = DEPTH_RAMP[upper];
  const percent = Math.round(
    ((clampedDepth - fromDepth) / (toDepth - fromDepth)) * 100,
  );
  if (percent <= 0) return fromColor;
  if (percent >= 100) return toColor;
  return `color-mix(in oklch, ${toColor} ${percent}%, ${fromColor})`;
}

const geometryCache = new WeakMap<ShapeDef, ThreadGeometry>();

/** Geometry is pure, so it is computed once per shape object and reused */
function threadGeometry(shape: ShapeDef): ThreadGeometry {
  const cached = geometryCache.get(shape);
  if (cached) return cached;

  const [width, height] = shape.viewBox;
  const paths: ThreadGeometry['paths'] = [];
  for (let i = 0; i < shape.n; i++) {
    const t = shape.n > 1 ? i / (shape.n - 1) : 0;
    const line =
      shape.grad?.(i, t) ??
      ([
        0,
        0,
        shape.axis === 'x' ? width : 0,
        shape.axis === 'y' ? height : 0,
      ] as [number, number, number, number]);
    paths.push({
      key: `p${i}`,
      d: shape.d(i, t),
      line,
      stops: shape
        .stops(t, i)
        .map(([offset, depth]: GradientStop, stopIndex) => ({
          key: `s${stopIndex}`,
          offset: roundToHundredths(clamp01(offset)),
          color: colorAtDepth(depth),
        })),
    });
  }

  const geometry = { width, height, paths };
  geometryCache.set(shape, geometry);
  return geometry;
}

/**
 * A static SVG bundle of accent-gradient threads. Decorative (aria-hidden),
 * positioned absolutely behind the content of an isolated well (z -1).
 * No client JS: drawing is CSS-only and skipped under reduced motion.
 */
const Threads = ({ shape, draw, aspect, className, style }: Props) => {
  const gradientIdPrefix = `thr${useId()}`;
  const shapeDef = typeof shape === 'string' ? THREAD_PRESETS[shape] : shape;
  const { width, height, paths } = threadGeometry(shapeDef);

  return (
    <svg
      className={cn('threads', className)}
      data-draw={draw}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio={aspect ?? shapeDef.aspect}
      aria-hidden="true"
      focusable="false"
      style={
        {
          '--thread-w': shapeDef.strokeWidth ?? 1.25,
          ...style,
        } as CSSProperties
      }
    >
      <defs>
        {paths.map(({ key, line: [x1, y1, x2, y2], stops }, i) => (
          <linearGradient
            key={key}
            id={`${gradientIdPrefix}-${i}`}
            gradientUnits="userSpaceOnUse"
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
          >
            {stops.map((stop) => (
              <stop
                key={stop.key}
                offset={stop.offset}
                style={{ stopColor: stop.color }}
              />
            ))}
          </linearGradient>
        ))}
      </defs>
      <g>
        {paths.map(({ key, d }, i) => (
          <path
            key={key}
            pathLength={1}
            d={d}
            stroke={`url(#${gradientIdPrefix}-${i})`}
            style={{ '--i': i } as CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
};

export default Threads;
