type Props = {
  r: number;
  g: number;
  b: number;
};

/**
 * Exposes Layout › Main color as --color-primary on the server, so the first
 * paint already uses it; every colour token in styles/tokens.css derives from
 * it.
 */
const CustomColor = ({ r, g, b }: Props) => {
  return (
    <style href="custom-color" precedence="high">
      {`:root { --color-primary: rgb(${r} ${g} ${b}); }`}
    </style>
  );
};

export default CustomColor;
