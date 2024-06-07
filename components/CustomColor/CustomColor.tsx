'use client';

type Props = {
  r: number;
  g: number;
  b: number;
};

const CustomColor = ({ r, g, b }: Props) => {
  return (
    <style global jsx>{`
      :root {
        --color-primary: ${r} ${g} ${b};
      }
    `}</style>
  );
};

export default CustomColor;
