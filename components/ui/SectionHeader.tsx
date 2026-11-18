import type { ReactNode } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { cn } from '@/utils/cn';
import {
  hasStructuredText,
  type StructuredTextField,
} from '@/utils/structuredText';
import { titleSize } from '@/utils/titleSize';

type Props = {
  title?: string | null;
  /** The lead under the title: a Structured Text field (`{ value }`) or a plain string */
  subtitle?: StructuredTextField | string | null;
  /** The heading tag. Pages pass h1 to the section that opens them (see [slug]/Content.tsx) */
  as?: 'h1' | 'h2' | 'h3';
  /** The type size, whatever the tag: h2 for a section (default), h1 for a page title */
  size?: 'h1' | 'h2';
  /** Id of the heading, for aria-labelledby on the section */
  id?: string;
  /** center (default): the usual section header. left: beside or above left-aligned content */
  align?: 'center' | 'left';
  /** Space under the header: the default, or none when the caller places it in a grid */
  gap?: 'default' | 'none';
  /** Placement only (grid columns, sticky) */
  className?: string;
  /** Placed under the subtitle: a Segmented, a TextLink */
  children?: ReactNode;
};

/**
 * The header of a section: its title and optional lead, centred by default.
 * A title longer than 60 characters drops one size.
 * Renders nothing when it has nothing to show.
 */
const SectionHeader = ({
  title,
  subtitle,
  as: Heading = 'h2',
  size = 'h2',
  id,
  align = 'center',
  gap = 'default',
  className,
  children,
}: Props) => {
  const lead =
    typeof subtitle === 'string'
      ? subtitle.trim()
        ? subtitle
        : null
      : hasStructuredText(subtitle)
        ? subtitle
        : null;
  if (!title && !lead && !children) return null;

  const scale = title ? titleSize(title, size) : null;

  return (
    <header
      className={cn(
        gap === 'default' && 'mb-10 lg:mb-14',
        align === 'center' && 'mx-auto max-w-[44rem] text-center',
        className,
      )}
    >
      {title && scale && (
        <Heading
          id={id}
          data-long={scale.long}
          className={cn(scale.className, align === 'left' && 'max-w-[26ch]')}
        >
          {title}
        </Heading>
      )}
      {lead && (
        <div
          className={cn(
            'text-lead text-fg-muted [&_p]:text-balance [&_p+p]:mt-3',
            align === 'left' ? 'max-w-[52ch]' : 'mx-auto max-w-[40rem]',
            title && 'mt-4',
          )}
        >
          {typeof lead === 'string' ? (
            <p>{lead}</p>
          ) : (
            <DatoStructuredText data={lead} />
          )}
        </div>
      )}
      {children && (
        <div className={cn((title || lead) && 'mt-6')}>{children}</div>
      )}
    </header>
  );
};

export default SectionHeader;
