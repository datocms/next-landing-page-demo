import {
  roundToHundredths,
  type ShapeDef,
  STOPS,
} from '@/components/ui/Ornaments';

/** Where the arch legs end: below the 240px viewBox, so they run off its bottom edge */
const BASE_Y = 250;

/**
 * Posts header arches (600×240): 16 nested arches with a deep crown and light
 * legs. The header gives them a fixed-height box at most 46% of the well wide,
 * and `meet` keeps the whole drawing inside it, so they scale with the well's
 * width only (never with its height) and stay clear of the copy columns. The
 * arch centre (x 300) lines up with the media column, so an author portrait
 * sits in the middle of the arches.
 * Declared at module scope so its geometry is computed once.
 */
const headerArches: ShapeDef = {
  viewBox: [600, 240],
  aspect: 'xMaxYMax meet',
  n: 16,
  d: (i) => {
    const centerX = 300;
    const halfSpan = 210 - 3 * i;
    const crownY = 28 + 3 * i;
    // Both control points sit this far above the base, which puts the curve's peak at crownY
    const controlLift = roundToHundredths(((BASE_Y - crownY) * 4) / 3);
    const left = centerX - halfSpan;
    const right = centerX + halfSpan;
    const controlY = roundToHundredths(BASE_Y - controlLift);
    return `M ${left} ${BASE_Y} C ${left} ${controlY}, ${right} ${controlY}, ${right} ${BASE_Y}`;
  },
  axis: 'y',
  stops: STOPS.arch,
};

export default headerArches;
