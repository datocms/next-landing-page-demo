/**
 * Thread geometry: bundles of thin gradient strokes, each one mixed from the
 * accent ramp (g-200 → grad-a → grad-b → grad-c). A path's base depth comes
 * from its place `t` in the bundle (light edge → deep edge) and its stops swing
 * lighter/deeper along the gradient axis, so a bundle reads as one shaded,
 * twisting ribbon of a single colour.
 */

/** [offset along the gradient axis 0–1, depth on the ramp 0–1] */
export type GradientStop = [offset: number, depth: number];

/** A bundle of threads. Components can declare their own (keep it at module scope: geometry is cached per object) */
export type ShapeDef = {
  viewBox: [w: number, h: number];
  /** preserveAspectRatio */
  aspect: string;
  /** Number of paths */
  n: number;
  /** Path data for path `i`; t = n > 1 ? i / (n - 1) : 0 */
  d: (i: number, t: number) => string;
  /** Gradient direction (userSpaceOnUse): x runs 0 → w, y runs 0 → h */
  axis: 'x' | 'y';
  /** Gradient stops of path `i`, usually one of the STOPS recipes */
  stops: (t: number, i: number) => GradientStop[];
  /** Overrides the gradient line of one path (mirrored halves) */
  grad?: (
    i: number,
    t: number,
  ) => [x1: number, y1: number, x2: number, y2: number];
  /** Default 1.25 */
  strokeWidth?: number;
};

export type ThreadPreset =
  | 'plinth'
  | 'loop'
  | 'ribbon'
  | 'converge'
  | 'convergeTop';

/** Rounds to 2 decimals, so path data and gradient offsets stay short */
export const roundToHundredths = (value: number) =>
  Math.round(value * 100) / 100;

/** Stop recipes, exported so a component can define its own ShapeDef (the posts spotlight, the posts header arches, the newsletter arches) */
export const STOPS = {
  /** Plinth and ribbon waves (axis x) */
  wave: (t: number): GradientStop[] => {
    const depth = 0.28 + 0.62 * t;
    const shift = (t - 0.5) * 0.2;
    return [
      [0, depth - 0.32],
      [0.34 + shift, depth],
      [0.7 + shift, depth + 0.22],
      [1, depth - 0.2],
    ];
  },
  /** Video loop (axis x) */
  loop: (t: number): GradientStop[] => {
    const depth = 0.3 + 0.6 * t;
    const shift = (t - 0.5) * 0.16;
    return [
      [0, depth - 0.3],
      [0.4 + shift, depth - 0.05],
      [0.68 + shift, depth + 0.2],
      [1, depth - 0.25],
    ];
  },
  /** Converging fans: pale outer end, deep at the port (axis x) */
  converge: (t: number): GradientStop[] => {
    const depth = 0.3 + 0.5 * t;
    return [
      [0, depth - 0.3],
      [0.6, depth],
      [1, depth + 0.2],
    ];
  },
  /** Nested arches: deep crown, light legs (axis y) */
  arch: (t: number): GradientStop[] => {
    const depth = 0.86 - 0.5 * t;
    return [
      [0, depth + 0.1],
      [0.55, depth - 0.05],
      [1, depth - 0.45],
    ];
  },
};

/** convergeTop is two mirrored fans of 12 paths: the place of path `i` within its own fan, 0–1 */
const tInHalf = (i: number) => (i < 12 ? i : i - 12) / 11;

export const THREAD_PRESETS: Record<ThreadPreset, ShapeDef> = {
  /** Hero plinth wave behind the hero photo, 588×448 */
  plinth: {
    viewBox: [588, 448],
    aspect: 'xMidYMid slice',
    n: 36,
    d: (i, t) => {
      const y = 168 + 3.2 * i;
      const swing = 0.8 + 0.4 * t;
      return `M -20 ${roundToHundredths(y)} C 140 ${roundToHundredths(y - 70 * swing)}, 300 ${roundToHundredths(y + 70 * swing)}, 420 ${roundToHundredths(y)} S 560 ${roundToHundredths(y - 40 * swing)}, 608 ${roundToHundredths(y + 10)}`;
    },
    axis: 'x',
    stops: STOPS.wave,
  },
  /** Video well loop, 1200×520: flat from the left, rising behind the player */
  loop: {
    viewBox: [1200, 520],
    aspect: 'xMidYMin slice',
    n: 20,
    d: (i) => {
      const flatY = 350 + 3 * i;
      const peakY = 130 + 2 * i;
      return `M -20 ${flatY} C 380 ${flatY}, 540 ${peakY}, 760 ${peakY} S 1140 ${flatY}, 1220 ${flatY}`;
    },
    axis: 'x',
    stops: STOPS.loop,
  },
  /** Low ribbon along the bottom of a tile or well, 588×160 */
  ribbon: {
    viewBox: [588, 160],
    aspect: 'xMidYMax slice',
    n: 28,
    d: (i, t) => {
      const y = 52 + 2.4 * i;
      const swing = 0.8 + 0.4 * t;
      return `M -20 ${roundToHundredths(y + 20 * swing)} C 150 ${roundToHundredths(y - 34 * swing)}, 340 ${roundToHundredths(y + 38 * swing)}, 608 ${roundToHundredths(y - 6 * swing)}`;
    },
    axis: 'x',
    stops: STOPS.wave,
  },
  /** Side fan converging on a window's side port; mirror the right one with -scale-x-100 */
  converge: {
    viewBox: [400, 400],
    aspect: 'none',
    n: 18,
    d: (_i, t) => {
      const outerY = roundToHundredths(30 + 340 * t);
      const portY = roundToHundredths(196 + 40 * t);
      return `M 0 ${outerY} C 210 ${outerY}, 290 ${portY}, 400 ${portY}`;
    },
    axis: 'x',
    stops: STOPS.converge,
    strokeWidth: 1,
  },
  /** Narrow-screen fan: 12 + 12 paths meeting the window's top port */
  convergeTop: {
    viewBox: [390, 88],
    aspect: 'none',
    n: 24,
    d: (i) => {
      const t = tInHalf(i);
      const outerY = roundToHundredths(8 + 64 * t);
      const bendY = roundToHundredths(74 + 6 * t);
      const portY = roundToHundredths(80 + 4 * t);
      return i < 12
        ? `M -10 ${outerY} C 110 ${outerY}, 150 ${bendY}, 191 ${portY}`
        : `M 400 ${outerY} C 280 ${outerY}, 240 ${bendY}, 199 ${portY}`;
    },
    axis: 'x',
    stops: (_t, i) => STOPS.converge(tInHalf(i)),
    grad: (i) => (i < 12 ? [0, 0, 195, 0] : [390, 0, 195, 0]),
    strokeWidth: 1,
  },
};
