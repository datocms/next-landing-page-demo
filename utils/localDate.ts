import { stripStega } from '@datocms/content-link';

/**
 * A CMS date or datetime in the page's language ("8 Aug 2026", "8. Aug. 2026"), with
 * the clean ISO value for <time dateTime>. UTC keeps server and client output
 * identical. Null when the CMS value is missing or not a date.
 */
export function localDate(value: string | null | undefined, locale: string) {
  if (!value) return null;
  const iso = stripStega(value);
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  const label = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);

  return { iso, label, time: date.getTime() };
}
