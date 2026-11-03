import type { CSSProperties } from 'react';
import ReactMarkdown from 'react-markdown';

type Props = {
  /** The CMS subtitle, in Markdown. Nothing renders without one */
  text: string | null | undefined;
  /** Type, colour, measure and margins */
  className: string;
};

/**
 * The hero lead under the H1, shared by every hero. It is step 1 of the load
 * choreography: it rises after the heading and before the CTA row (motion
 * users only).
 */
const HeroSubtitle = ({ text, className }: Props) => {
  if (!text) return null;

  return (
    <div
      data-hero-rise=""
      style={{ '--d': 1 } as CSSProperties}
      className={className}
    >
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
};

export default HeroSubtitle;
