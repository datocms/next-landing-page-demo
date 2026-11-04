import { nestedArches } from '@/components/ui/Ornaments';

/**
 * Posts header arches (600×240): 16 nested arches with a deep crown and light
 * legs. The header gives them a fixed-height box at most 46% of the well wide,
 * and `meet` keeps the whole drawing inside it, so they scale with the well's
 * width only (never with its height) and stay clear of the copy columns. The
 * arch centre (x 300) lines up with the media column, so an author portrait
 * sits in the middle of the arches.
 */
export const headerArches = nestedArches({
  viewBox: [600, 240],
  n: 16,
  centerX: 300,
  baseY: 250,
  halfSpan: (i) => 210 - 3 * i,
  crownY: (i) => 28 + 3 * i,
});
