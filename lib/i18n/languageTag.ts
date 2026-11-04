// Kept out of locales.ts, which queries DatoCMS, so client components can import it
import type { SiteLocale } from '@/lib/datocms/graphql';

/** DatoCMS writes regional locales with an underscore (pt_BR), HTML and browsers with a hyphen (pt-BR) */
export const toLanguageTag = (locale: string) => locale.replaceAll('_', '-');

/** The DatoCMS locale for a language tag: pt-BR → pt_BR */
export const fromLanguageTag = (tag: string) =>
  tag.replaceAll('-', '_') as SiteLocale;
