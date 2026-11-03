type Props = {
  r: number;
  g: number;
  b: number;
};

/**
 * Exposes the project's main color (Layout › Main color) as --color-primary.
 * Rendered on the server so the very first paint already uses the brand color.
 * Every colour token in styles/tokens.css derives from it: the neutrals
 * (--bg-2, --surface, --ink*, --line*), the accent set (--accent-solid,
 * --accent-text, --accent-wash, --accent-fill), the one-hue ramp
 * (--g-50 … --g-900) and its gradients, and the tinted shadows. The tone-0 …
 * tone-5 stops (styles/utilities.css) derive from it too.
 */
const CustomColor = ({ r, g, b }: Props) => {
  return (
    <style href="custom-color" precedence="high">
      {`:root { --color-primary: rgb(${r} ${g} ${b}); }`}
    </style>
  );
};

export default CustomColor;
