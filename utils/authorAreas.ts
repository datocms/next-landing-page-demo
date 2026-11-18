import { stripStega } from '@datocms/content-link';

/** An author's areas of interest: one Area of interest block each in the CMS */
export const areaLabels = (areas?: { label: string }[] | null) =>
  (areas ?? [])
    .map((area) => area.label)
    // In Draft Mode an empty label can still carry Content Link markers
    .filter((label) => stripStega(label).trim());
