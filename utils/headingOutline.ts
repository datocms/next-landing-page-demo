import { stripStega } from '@datocms/content-link';
import { isHeading, type Node } from 'datocms-structured-text-utils';

/** One entry of a long-form page's outline (its "On this page" links) */
export type OutlineHeading = {
  /** The heading node (the renderer looks its anchor id up by it) */
  node: Node;
  /** Unique, stable anchor id (`^[a-z0-9-]+$`) */
  id: string;
  /** Raw heading text for the table of contents */
  text: string;
};

/** Visible text of a Structured Text node (raw: any stega payload is kept) */
const plainText = (node: Node): string => {
  if ('value' in node && typeof node.value === 'string') return node.value;
  if ('children' in node) {
    return (node.children as Node[]).map(plainText).join('');
  }
  return '';
};

/** Comparable form of a CMS string: stega stripped, whitespace collapsed, lowercase */
const normalize = (value: string) =>
  stripStega(value).replace(/\s+/g, ' ').trim().toLowerCase();

/** URL-safe id from heading text: ASCII lowercase, runs of anything else become one dash */
const slugify = (value: string) =>
  stripStega(value)
    .normalize('NFKD')
    // Drop the accents NFKD splits off (é → e)
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Whether a heading only repeats the page title (stega, case and spacing aside) */
export function repeatsTitle(heading: Node, title: string) {
  return normalize(plainText(heading)) === normalize(title);
}

/**
 * The root-level headings that render as h2 (levels 1 and 2), minus `skip`,
 * each with a unique anchor id. Duplicate texts get -2, -3… suffixes. Shared
 * by the legal and docs pages and their "On this page" rails.
 */
export function headingOutline(
  rootChildren: readonly Node[],
  skip?: Node | null,
): OutlineHeading[] {
  const usedIds = new Set<string>();
  const headings: OutlineHeading[] = [];

  for (const node of rootChildren) {
    if (node === skip || !isHeading(node) || node.level > 2) continue;

    const text = plainText(node);
    const baseId = slugify(text) || 'section';
    let id = baseId;
    for (let n = 2; usedIds.has(id); n++) id = `${baseId}-${n}`;
    usedIds.add(id);

    headings.push({ node, id, text });
  }

  return headings;
}
