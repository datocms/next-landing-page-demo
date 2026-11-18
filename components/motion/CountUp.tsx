import type { CSSProperties } from 'react';

type Props = {
  /** The figure as it should read once counted, already formatted ("15,000", "1.5M") */
  text: string;
};

/**
 * A formatted figure whose digits roll up from 0 like an odometer when the
 * `.reveal` element around it settles in (styles/motion.css). Each digit stays
 * in the markup as its real character, only made see-through, with a reel of 0
 * to 9 drawn over it and turned to that digit: the text is the final figure for
 * screen readers, copying and search, it is right without JavaScript, and the
 * width never changes while it counts. Separators and suffixes stay still.
 * A server component: the shared reveal drives it, no script of its own.
 */
const CountUp = ({ text }: Props) => {
  let digitIndex = 0;

  return (
    <>
      {Array.from(text).map((char, index) => {
        if (!/[0-9]/.test(char)) return char;
        const style = {
          '--d': Number(char),
          '--k': digitIndex++,
        } as CSSProperties;
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: the characters of a fixed string
          <span key={index} className="count-digit" style={style}>
            {char}
          </span>
        );
      })}
    </>
  );
};

export default CountUp;
