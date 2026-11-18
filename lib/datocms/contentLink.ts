import { decodeStega, stripStega } from '@datocms/content-link';

/*
 * Helpers for Content Link (Visual Editing) on values the Content Delivery API
 * cannot mark itself. In Draft Mode every text field, and every asset's alt
 * text, carries an invisible stega marker with the URL of its field in
 * DatoCMS. Numbers, booleans, dates and images shown without their alt text
 * carry nothing, so they borrow the marker of a text field next to them.
 * Outside Draft Mode there is no marker: every helper returns an empty value
 * and no Content Link attribute is rendered.
 */

/** Only the invisible stega marker of a CMS string ("" when there is none) */
export function stegaOnly(text: string | null | undefined): string {
  if (!text) return '';
  const clean = stripStega(text);
  return text.startsWith(clean) ? text.slice(clean.length) : '';
}

/**
 * An alt text to render, keeping the CMS alt's stega marker: a decorative
 * image passes "" and still opens its image field when clicked, while screen
 * readers get an empty alt (the marker is made of invisible characters).
 */
export function altWithMarker(
  rendered: string,
  cmsAlt: string | null | undefined,
): string {
  return rendered + stegaOnly(cmsAlt);
}

/**
 * Content Link URL of another field of the same record or block, for
 * `data-datocms-content-link-url`. `source` is any stega-marked text of that
 * record or block (its title, its label): its field path is kept and its last
 * segment replaced, so "sections.en.7.statistics.0.label" with "quantity"
 * gives "sections.en.7.statistics.0.quantity".
 *
 * For a top-level field of a localized record pass the whole path instead,
 * with `{locale}` where the locale goes: fieldEditUrl(tier.name,
 * 'monthly_price') or fieldEditUrl(post.title, 'date.{locale}').
 */
export function siblingEditUrl(
  source: string | null | undefined,
  field: string,
): string | undefined {
  const href = source ? decodeStega(source)?.href : undefined;
  if (!href) return undefined;
  const [recordUrl, hash = ''] = href.split('#');
  const path = new URLSearchParams(hash).get('fieldPath');
  if (!path) return recordUrl;
  const segments = path.split('.');
  segments[segments.length - 1] = field;
  return `${recordUrl}#fieldPath=${segments.join('.')}`;
}

/**
 * Content Link URL of a top-level field of the record `source` belongs to.
 * `fieldPath` is the field's API key, then `.{locale}` when it is localized:
 * replaced with the locale `source` was read in, or with `locale` when
 * `source` is not localized itself. Without a path, the record.
 */
export function fieldEditUrl(
  source: string | null | undefined,
  fieldPath?: string,
  locale?: string,
): string | undefined {
  const href = source ? decodeStega(source)?.href : undefined;
  if (!href) return undefined;
  const [recordUrl, hash = ''] = href.split('#');
  if (!fieldPath) return recordUrl;
  const sourceLocale =
    new URLSearchParams(hash).get('fieldPath')?.split('.')[1] ?? locale;
  const path = fieldPath.includes('{locale}')
    ? sourceLocale && fieldPath.replace('{locale}', sourceLocale)
    : fieldPath;
  return path ? `${recordUrl}#fieldPath=${path}` : recordUrl;
}

/**
 * Content Link URL of a field that contains `source`, `keep` segments up its
 * field path: a feature label at "features.en.2.label" gives the plan's
 * feature list with keep = 2 ("features.en"), where a missing feature is added.
 */
export function ancestorEditUrl(
  source: string | null | undefined,
  keep: number,
): string | undefined {
  const href = source ? decodeStega(source)?.href : undefined;
  if (!href) return undefined;
  const [recordUrl, hash = ''] = href.split('#');
  const path = new URLSearchParams(hash).get('fieldPath');
  if (!path) return recordUrl;
  return `${recordUrl}#fieldPath=${path.split('.').slice(0, keep).join('.')}`;
}
