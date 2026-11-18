import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

/**
 * A quote inside long-form content: muted text beside a 2px grey rule.
 * The look comes from `.prose blockquote` in styles/prose.css.
 */
const QuoteBlock = ({ children }: Props) => {
  if (!children) return null;

  return <blockquote>{children}</blockquote>;
};

export default QuoteBlock;
