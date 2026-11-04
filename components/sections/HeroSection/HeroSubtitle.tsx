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

/** The hero subtitle: step 1 of the hero's load animation, between the title and the buttons */
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
