import { resolveUiLocale } from '@/lib/i18n/uiStrings';

/** Below this a figure is written out in full ("562,000"); from it, compactly */
const COMPACT_FROM = 1_000_000;

/**
 * A statistic's figure in the page's language. Up to a million it is written
 * out with the locale's grouping (562,000 · 562.000 · 562 000); from a million
 * it is abbreviated ("1.5M", "1,5 Mio.").
 */
export function formatFigure(quantity: number, locale: string) {
  const tag = resolveUiLocale(locale);
  if (Math.abs(quantity) < COMPACT_FROM) {
    return new Intl.NumberFormat(tag).format(quantity);
  }
  return new Intl.NumberFormat(tag, {
    notation: 'compact',
    compactDisplay: 'short',
    maximumSignificantDigits: 3,
  }).format(quantity);
}
