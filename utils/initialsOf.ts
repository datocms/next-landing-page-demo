import { stripStega } from '@datocms/content-link';

/** "Laura Adams" → "LA": a portrait stand-in for a person without a photo */
const initialsOf = (name: string) =>
  stripStega(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');

export default initialsOf;
