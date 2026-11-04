import { nestedArches } from '@/components/ui/Ornaments';

/** Twelve nested arches pinned bottom-right in the well, clear of the copy column and the capture */
export const newsletterArches = nestedArches({
  viewBox: [360, 200],
  n: 12,
  centerX: 250,
  baseY: 210,
  halfSpan: (i) => 104 - 4 * i,
  crownY: (i) => 22 + 4 * i,
});
