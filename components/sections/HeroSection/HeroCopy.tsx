import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { cn } from '@/utils/cn';
import {
  hasStructuredText,
  type StructuredTextField,
} from '@/utils/structuredText';
import { titleSize } from '@/utils/titleSize';

/**
 * The hero h1 at display size. A title of 53 characters or more is set one
 * notch smaller, so German and Spanish keep a sane line count.
 */
export const HeroTitle = ({
  title,
  id,
  className,
}: {
  /** Raw CMS title (it keeps its Content Link marker) */
  title: string;
  /** For the section's aria-labelledby */
  id: string;
  /** Placement and measure */
  className?: string;
}) => {
  const scale = titleSize(title, 'display');

  return (
    <h1
      id={id}
      data-long={scale.long}
      className={cn(scale.className, className)}
    >
      {title}
    </h1>
  );
};

/** The hero lead (a Structured Text field); nothing renders without one */
export const HeroLead = ({
  text,
  className,
}: {
  text: StructuredTextField | null | undefined;
  /** Placement and measure */
  className?: string;
}) => {
  if (!hasStructuredText(text)) return null;

  return (
    <div
      className={cn(
        'text-lead text-fg-muted [&_p]:text-balance [&_p+p]:mt-3',
        className,
      )}
    >
      <DatoStructuredText data={text} />
    </div>
  );
};
