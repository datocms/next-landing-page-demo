import { stripStega } from '@datocms/content-link';

/**
 * The six tone utilities (styles/utilities.css): stops of the one accent hue that
 * set --s, --s-hi, --s-grad, --s-wash, --s-mark, --s-text and --s-at.
 * Tailwind only generates classes it sees as literal strings, so dynamic tones
 * always come from this list, never from `tone-${i}`.
 */
export const TONES = [
  'tone-0',
  'tone-1',
  'tone-2',
  'tone-3',
  'tone-4',
  'tone-5',
] as const;

export type Tone = (typeof TONES)[number];

/**
 * Markers for numbered points in long copy (changelog headings, about intro,
 * detail items): circle, square and triangle on deepening tones. Pick one with
 * `MARKER_SHAPES[i % MARKER_SHAPES.length]`.
 */
export const MARKER_SHAPES = [
  'shape-circle tone-1',
  'shape-square tone-3',
  'shape-triangle tone-5',
] as const;

type ToneIndex = 0 | 1 | 2 | 3 | 4 | 5;

/** Cycle through the tones by position (features, team rings, dropdown dots, docs cards). */
export const toneClass = (i: number): Tone => TONES[((i % 6) + 6) % 6];

/** Stable tone index for any CMS string (tag chips, author rings, cover fallbacks), hashed on the visible text. */
export function toneIndex(value: string): ToneIndex {
  const text = stripStega(value);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return (hash % 6) as ToneIndex;
}

/** Left-to-right ramp: n items spread from tone `from` to tone `to` (stats 1→4, plans 1→5). */
export const toneRamp = (i: number, n: number, from = 1, to = 5): Tone =>
  TONES[
    n <= 1
      ? Math.round((from + to) / 2)
      : Math.round(from + (i * (to - from)) / (n - 1))
  ];
