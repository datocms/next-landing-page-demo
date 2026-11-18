/**
 * Interface copy around CMS content (labels, counters, fallbacks). The texts
 * live in the Interface Text record in DatoCMS; `en` defines the keys and is
 * the English fallback for any key the record leaves empty.
 *
 * uiString looks a locale's dictionary up in, in order:
 * 1. the request store, filled on the server by primeUiStrings (React's
 *    `cache()` memoises it per request; in the client build it does not
 *    memoise, so this lookup simply misses there);
 * 2. the registry, a module-level map that UiStringsProvider fills in the browser;
 * 3. the English fallback.
 */
import { stripStega } from '@datocms/content-link';
import { cache } from 'react';
import { en } from './en';
import type { Dictionary, Entry, UiStringKey } from './types';

/** The dictionaries of the current server request */
const getRequestStore = cache(() => new Map<string, Dictionary>());

/** The dictionaries registered by UiStringsProvider */
const registry = new Map<string, Dictionary>();

/** The lowercased base language code: 'it-CH' becomes 'it' */
function baseCode(locale?: string | null): string | undefined {
  return locale?.toLowerCase().split(/[-_]/)[0] || undefined;
}

/** Stores the dictionary of `locale` in the request store or in the registry */
export function registerUiStrings(
  target: 'request' | 'registry',
  locale: string,
  dictionary: Dictionary,
): void {
  const code = baseCode(locale);
  if (!code) return;
  (target === 'request' ? getRequestStore() : registry).set(code, dictionary);
}

/** The registered dictionary for a code, if any */
function findDictionary(code: string | undefined): Dictionary | undefined {
  if (!code) return undefined;
  return getRequestStore().get(code) ?? registry.get(code);
}

/** The language code of a registered dictionary ('it', 'it-CH'…); 'en' for anything unknown or missing */
export function resolveUiLocale(locale?: string | null): string {
  const code = baseCode(locale);
  return code && findDictionary(code) ? code : 'en';
}

/** The entry's text, picking the plural form for `count` when it has one */
function pickForm(entry: Entry, locale: string, count: number): string {
  if (typeof entry === 'string') return entry;
  return new Intl.PluralRules(locale).select(count) === 'one'
    ? entry.one
    : entry.other;
}

/**
 * One interface string as visible text, resolved for `locale` and filled with
 * `vars` (`{name}` placeholders). Plural keys pick their form from `vars.n`.
 *
 *   uiLabel(locale, 'latestPosts')                    // "Ultimi articoli"
 *   uiLabel(locale, 'postCount', { n: 12 })           // "12 articoli"
 *   uiLabel(locale, 'pageOf', { page: 1, total: 2 })  // "Pagina 1 di 2"
 *
 * In Draft Mode the text keeps its invisible Content Link marker, so clicking
 * it opens its field in the Interface Text record: use it only where the text
 * is rendered as page content. Everywhere else (aria text, a placeholder, a
 * <title>, metadata, a string that is compared, split or shared) use uiString.
 * Raw CMS values passed as vars keep their markers too.
 */
export function uiLabel(
  locale: string | null | undefined,
  key: UiStringKey,
  vars?: Record<string, string | number>,
): string {
  const uiLocale = resolveUiLocale(locale);
  const dictionary = findDictionary(uiLocale) ?? en;
  const template = pickForm(dictionary[key], uiLocale, Number(vars?.n ?? 0));

  if (!vars) return template;

  // An unknown placeholder is left as written
  return template.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    name in vars ? String(vars[name]) : placeholder,
  );
}

/**
 * The same text as uiLabel without any Content Link marker: for aria text,
 * placeholders, titles, metadata and any string the code works with.
 */
export function uiString(
  locale: string | null | undefined,
  key: UiStringKey,
  vars?: Record<string, string | number>,
): string {
  return stripStega(uiLabel(locale, key, vars));
}
