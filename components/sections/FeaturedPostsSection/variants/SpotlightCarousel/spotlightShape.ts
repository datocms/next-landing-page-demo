import { type ShapeDef, STOPS } from '@/components/ui/Ornaments';

/**
 * Spotlight threads (1200×540, anchored bottom-right): a bundle that enters at
 * the right edge, runs along the well's bottom band under the cover, then
 * curves up and ends behind it, so the threads "plug into" the post and never
 * reach the text column on the left. Declared at module scope so its geometry
 * is computed once.
 */
const spotlightShape: ShapeDef = {
  viewBox: [1200, 540],
  aspect: 'xMaxYMax slice',
  n: 20,
  d: (i) => {
    const bandY = Math.round((478 + 2.2 * i) * 100) / 100;
    const endX = 720 + 4 * i;
    return `M 1220 ${bandY} C 900 ${bandY}, ${endX} ${bandY}, ${endX} ${300 + 3 * i}`;
  },
  axis: 'x',
  stops: STOPS.loop,
};

export default spotlightShape;
