import { stripStega } from '@datocms/content-link';

const EDGE_PUNCTUATION =
  /^[\s.,:;!?'"‘’“”«»()[\]\-–—…]+|[\s.,:;!?'"‘’“”«»()[\]\-–—…]+$/g;

/** Comparable text: no stega payload, lowercase, single spaces, no punctuation at either end */
const normalise = (value: string) =>
  stripStega(value)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(EDGE_PUNCTUATION, '');

/**
 * True when a post's description only repeats its title (the SEO description
 * is often just the subtitle after the colon, as in "Next-Gen Image Formats:
 * WebP and AVIF" → "WebP and AVIF"), so the excerpt line would add nothing.
 * Compares stega-stripped text; when the line is kept, render the raw string.
 */
export function isRedundantExcerpt(
  title: string | null | undefined,
  description: string | null | undefined,
) {
  if (!description) {
    return false;
  }
  const excerpt = normalise(description);
  return excerpt === '' || normalise(title ?? '').includes(excerpt);
}
