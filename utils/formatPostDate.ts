import { stripStega } from '@datocms/content-link';

// UTC keeps the server and client output identical, so client components never hit a hydration mismatch
const formatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

/**
 * Formats a CMS date or datetime as a short meta label ("Oct 14, 2026") and
 * returns the clean ISO value for <time dateTime>.
 */
export default function formatPostDate(value: string) {
  const iso = stripStega(value);
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return { iso, label: value };
  }

  return { iso, label: formatter.format(date) };
}
