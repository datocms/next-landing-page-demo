import { accentTokens } from '@/utils/accent';

type Props = {
  r: number;
  g: number;
  b: number;
};

/**
 * Writes the accent tokens for Layout › Main color on :root, on the server, so
 * the first paint already uses them: the colour itself, the label colour that
 * reads on it (black or white, from its WCAG luminance) and its hover fill.
 * `--accent-ink` derives from `--accent` in styles/tokens.css, which also holds
 * the defaults these replace.
 */
const CustomColor = ({ r, g, b }: Props) => {
  const { accent, onAccent, accentHover } = accentTokens({ r, g, b });

  return (
    <style href="custom-color" precedence="high">
      {`:root { --accent: ${accent}; --on-accent: ${onAccent}; --accent-hover: ${accentHover}; }`}
    </style>
  );
};

export default CustomColor;
