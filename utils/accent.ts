/** An sRGB colour, each channel 0–255 */
export type Rgb = { r: number; g: number; b: number };

/** One sRGB channel (0–255) as linear light (0–1), per WCAG 2.x */
const linear = (channel: number) => {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

/** WCAG relative luminance Y: 0 for black, 1 for white */
export const relativeLuminance = ({ r, g, b }: Rgb) =>
  0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);

/** WCAG contrast ratio between two colours, 1 to 21 */
export const contrastRatio = (a: Rgb, b: Rgb) => {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x,
  );
  return (hi + 0.05) / (lo + 0.05);
};

/**
 * A fill takes a white label, the convention for a coloured button, as long as white
 * keeps a 3:1 contrast on it: 1.05 / (Y + 0.05) = 3 at Y = 0.3. Lighter fills (a
 * pastel, a yellow) take a near-black label instead
 */
const DARK_LABEL_FROM = 0.3;

const BLACK: Rgb = { r: 0, g: 0, b: 0 };
const WHITE: Rgb = { r: 255, g: 255, b: 255 };

const mix = (from: Rgb, to: Rgb, amount: number): Rgb => ({
  r: Math.round(from.r + (to.r - from.r) * amount),
  g: Math.round(from.g + (to.g - from.g) * amount),
  b: Math.round(from.b + (to.b - from.b) * amount),
});

const css = ({ r, g, b }: Rgb) => `rgb(${r} ${g} ${b})`;

/**
 * The three runtime tokens of an accent fill:
 * - `accent`: the colour itself, unchanged
 * - `onAccent`: the label on it, white unless the fill is too light for it
 * - `accentHover`: the fill mixed 8% away from its label (darker under a white
 *   label, lighter under a dark one), so hovering never costs contrast
 */
export function accentTokens(color: Rgb) {
  const darkLabel = relativeLuminance(color) > DARK_LABEL_FROM;
  return {
    accent: css(color),
    onAccent: darkLabel ? '#16161a' : '#fff',
    accentHover: css(mix(color, darkLabel ? WHITE : BLACK, 0.08)),
  };
}
