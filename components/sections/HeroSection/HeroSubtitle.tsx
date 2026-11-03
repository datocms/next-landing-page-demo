import type { CSSProperties } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import {
  hasStructuredText,
  type StructuredTextField,
} from '@/utils/structuredText';

type Props = {
  /** The CMS subtitle, in Structured Text. Nothing renders without one */
  text: StructuredTextField | null | undefined;
  /** Type, colour, measure and margins */
  className: string;
};

/**
 * The hero lead under the H1, shared by every hero. It is step 1 of the load
 * choreography: it rises after the heading and before the CTA row (motion
 * users only).
 */
const HeroSubtitle = ({ text, className }: Props) => {
  if (!hasStructuredText(text)) return null;

  return (
    <div
      data-hero-rise=""
      style={{ '--d': 1 } as CSSProperties}
      className={className}
    >
      <DatoStructuredText data={text} />
    </div>
  );
};

export default HeroSubtitle;
