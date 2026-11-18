import { stripStega } from '@datocms/content-link';

const formatters = new Map<string, Intl.DateTimeFormat>();

// UTC keeps the server and client output identical, so client components never hit a hydration mismatch
function formatterFor(locale: string) {
  let formatter = formatters.get(locale);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
    formatters.set(locale, formatter);
  }
  return formatter;
}

/**
 * Formats a CMS date or datetime as a short meta label ("Oct 14, 2026", or
 * "14. Okt. 2026" with `locale` "de") and returns the clean ISO value for
 * <time dateTime>. Without a locale the label is US English.
 */
export function formatDate(value: string, locale = 'en-US') {
  const iso = stripStega(value);
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return { iso, label: value };
  }

  let formatter: Intl.DateTimeFormat;
  try {
    formatter = formatterFor(locale);
  } catch {
    // An unknown locale code: fall back to the default label
    formatter = formatterFor('en-US');
  }

  return { iso, label: formatter.format(date) };
}
