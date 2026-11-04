/**
 * Interface copy around CMS content (labels, counters, fallbacks): content
 * stays in DatoCMS, and only what no record can hold lives here. `en` defines
 * the keys, and every other locale must have them all.
 */
import { de } from './de';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { it } from './it';
import type { Dictionary, Entry, UiStringKey } from './types';

const DICTIONARIES = { en, it, de, fr, es } satisfies Record<
  string,
  Dictionary
>;

type UiLocale = keyof typeof DICTIONARIES;

/** The supported locale for a code ('it', 'it-CH'…); English for anything unknown or missing */
export function resolveUiLocale(locale?: string | null): UiLocale {
  const code = locale?.toLowerCase().split(/[-_]/)[0];
  return code && code in DICTIONARIES ? (code as UiLocale) : 'en';
}

/** The entry's text, picking the plural form for `count` when it has one */
function pickForm(entry: Entry, locale: UiLocale, count: number): string {
  if (typeof entry === 'string') return entry;
  return new Intl.PluralRules(locale).select(count) === 'one'
    ? entry.one
    : entry.other;
}

/**
 * One interface string, resolved for `locale` and filled with `vars`
 * (`{name}` placeholders). Plural keys pick their form from `vars.n`.
 *
 *   uiString(locale, 'latestPosts')                    // "Ultimi articoli"
 *   uiString(locale, 'postCount', { n: 12 })           // "12 articoli"
 *   uiString(locale, 'pageOf', { page: 1, total: 2 })  // "Pagina 1 di 2"
 *
 * Pass raw CMS values as vars (an author name keeps its stega), and run
 * stripStega on the result only when it becomes aria text.
 */
export function uiString(
  locale: string | null | undefined,
  key: UiStringKey,
  vars?: Record<string, string | number>,
): string {
  const uiLocale = resolveUiLocale(locale);
  const template = pickForm(
    DICTIONARIES[uiLocale][key],
    uiLocale,
    Number(vars?.n ?? 0),
  );

  if (!vars) return template;

  // An unknown placeholder is left as written
  return template.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    name in vars ? String(vars[name]) : placeholder,
  );
}
