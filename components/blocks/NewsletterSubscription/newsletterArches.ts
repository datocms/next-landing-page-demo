import {
  roundToHundredths,
  type ShapeDef,
  STOPS,
} from '@/components/ui/Ornaments';

/** Where the arch legs end: below the 200px viewBox, so they run off its bottom edge */
const BASE_Y = 210;

/**
 * Newsletter arches for the 680px reading column, 360×200: twelve nested arches
 * whose legs run off the bottom edge. The outer arch spans x 146–354, so pinned
 * bottom-right in the well they start 214px in from its right edge: right of
 * the 360px copy column, and right of the capture, which stops 200px short of
 * the content edge (NewsletterForm). Deep crown, light legs (axis y).
 */
const newsletterArches: ShapeDef = {
  viewBox: [360, 200],
  aspect: 'xMaxYMax meet',
  n: 12,
  d: (i) => {
    const centerX = 250;
    const halfSpan = 104 - 4 * i;
    const crownY = 22 + 4 * i;
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

export default newsletterArches;
