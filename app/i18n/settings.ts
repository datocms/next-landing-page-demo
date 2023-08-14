import { SiteLocale } from '@/graphql/generated';

export const fallbackLng = 'en' as SiteLocale;
export const languages = [
  fallbackLng,
  'it',
  'de',
  'fr',
  'es',
  'pt',
  'sv',
  'ru',
] as SiteLocale[];

export const langageDictionary = {
  en: 'English',
  it: 'Italian',
  ru: 'Russian',
  de: 'German',
  pt: 'Portuguese',
  fr: 'French',
  sv: 'Swedish',
  es: 'Spanish',
};
