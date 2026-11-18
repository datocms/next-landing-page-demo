import { stripStega } from '@datocms/content-link';

/** True when a CMS string has visible text (Draft Mode can leave nothing but Content Link markers) */
export const hasText = (value?: string | null): value is string =>
  Boolean(value && stripStega(value).trim());
