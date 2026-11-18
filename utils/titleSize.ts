import { stripStega } from '@datocms/content-link';

/** The four headline sizes, largest first (the type utilities of styles/utilities.css) */
export type TitleSize = 'display' | 'h1' | 'h2' | 'h3';

// Literal class names: Tailwind only generates the classes it can read in the source
const STEPS: { size: TitleSize; className: string }[] = [
  { size: 'display', className: 'text-display' },
  { size: 'h1', className: 'text-h1' },
  { size: 'h2', className: 'text-h2' },
  { size: 'h3', className: 'text-h3' },
];

/** From this many characters a title is set one notch smaller (`data-long`) */
const LONG_FROM = 53;

/**
 * The size class of a CMS title, so that long titles (German, mostly) keep a
 * sane line count: up to 52 characters the size asked for, from 53 the same
 * token one notch smaller (`data-long`, see styles/utilities.css). Spread the
 * result on the heading:
 *
 *   const { className, long } = titleSize(title, 'h2');
 *   <h2 className={className} data-long={long}>{title}</h2>
 *
 * The count ignores the invisible Content Link markers of Draft Mode.
 */
export function titleSize(title: string, size: TitleSize) {
  const length = stripStega(title).trim().length;
  const step = STEPS.find((candidate) => candidate.size === size) ?? STEPS[0];

  return {
    className: step.className,
    /** `data-long` value: present (smaller) or absent */
    long: length >= LONG_FROM ? '' : undefined,
  };
}
