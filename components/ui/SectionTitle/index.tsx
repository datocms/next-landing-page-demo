import { stripStega } from '@datocms/content-link';
import type { ReactNode } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { cn } from '@/utils/cn';
import type { SectionHeadingLevel } from '@/utils/headingLevel';
import {
  hasStructuredText,
  type StructuredTextField,
  structuredTextToPlainParagraph,
  structuredTextToPlainText,
} from '@/utils/structuredText';
import { mergeTitleWithLead } from '@/utils/twoToneHeading';
import HeadingText from './HeadingText';

type Props = {
  title?: string | null;
  /** Structured Text lead copy shown under the title */
  paragraph?: StructuredTextField | null;
  /**
   * left (default); center for short statements; split puts a short lead beside the title from lg.
   * A split lead longer than SPLIT_LEAD_MAX characters falls back to left, under the title
   */
  align?: 'left' | 'center' | 'split';
  as?: SectionHeadingLevel;
  /** Size of a promoted h1: 'section' (keeps the h2 size, default) or 'page' (text-h1, two-tone split) */
  h1Size?: 'page' | 'section';
  /** 'auto' (default) merges a short title and one-sentence lead into one two-tone h2; false never merges */
  twoTone?: 'auto' | false;
  /** Space below the header: default 32 (24 below 768), lg 40 (32), none 0 */
  gap?: 'default' | 'lg' | 'none';
  /** Id of the heading element, for aria-labelledby on the section */
  id?: string;
  /** Controls on the title row (gallery arrows, a toggle), right-aligned from lg */
  aside?: ReactNode;
  /** Placement only (grid columns, sticky, max width) and custom properties such as [--lead-max:680px] */
  className?: string;
  /** Extra content placed after the lead (for example a billing period toggle) */
  children?: ReactNode;
};

const GAP_CLASS = {
  default: 'mb-8 max-md:mb-6',
  lg: 'mb-10 max-md:mb-8',
  none: '',
} as const;

/**
 * A split lead reads as part of the heading only while it stays about one line in its half
 * of the row. Longer copy floats away from a short title, so it goes under the title instead
 */
const SPLIT_LEAD_MAX = 100;

/**
 * The header of a page section: title, Structured Text lead and optional
 * controls, left-aligned, centred or split in two columns. A short title and a
 * one-sentence, unformatted lead merge into a single two-tone heading.
 */
const SectionTitle = ({
  title,
  paragraph,
  align = 'left',
  as: Heading = 'h2',
  h1Size = 'section',
  twoTone = 'auto',
  gap = 'default',
  id,
  aside,
  className,
  children,
}: Props) => {
  const hasLead = hasStructuredText(paragraph);
  if (!title && !hasLead && !children && !aside) {
    return null;
  }

  const resolvedAlign =
    align === 'split' &&
    hasLead &&
    stripStega(structuredTextToPlainText(paragraph)).trim().length >
      SPLIT_LEAD_MAX
      ? 'left'
      : align;
  const isPageTitle = Heading === 'h1' && h1Size === 'page';
  // Only a single unformatted paragraph can be set inline in the heading
  const plainLead = structuredTextToPlainParagraph(paragraph);
  const merged =
    title && !isPageTitle && twoTone === 'auto'
      ? mergeTitleWithLead(title, plainLead)
      : null;
  const headerClass = cn('reveal', GAP_CLASS[gap], className);

  // Content Link: a two-tone heading is one target. TwoTone's stega sits at the end of its
  // second half, so the group lifts the target from that span to the whole heading. A merged
  // heading holds two fields: the group makes the heading the title's target, and the
  // boundary keeps the lead its own target inside it (one stega source per group)
  const heading = title ? (
    <Heading
      id={id}
      className={
        isPageTitle
          ? 'max-w-[760px] text-h1 text-ink'
          : 'max-w-[700px] text-h2 text-ink'
      }
      data-datocms-content-link-group={isPageTitle || merged ? true : undefined}
    >
      <HeadingText
        title={title}
        lead={plainLead}
        isPageTitle={isPageTitle}
        merged={merged}
      />
    </Heading>
  ) : null;

  const lead =
    hasLead && !merged ? (
      <div
        className={cn(
          'section-lead',
          // On the <p> itself: base :where(p) sets text-wrap: pretty, which would win over inheritance
          resolvedAlign === 'center' && 'text-balance [&_p]:text-balance',
        )}
      >
        <DatoStructuredText data={paragraph} />
      </div>
    ) : null;

  if (resolvedAlign === 'center') {
    return (
      <header className={headerClass}>
        <div className="mx-auto grid max-w-[760px] justify-items-center gap-3 text-center">
          {heading}
          {lead}
          {children && <div className="mt-3">{children}</div>}
          {aside && <div className="mt-3">{aside}</div>}
        </div>
      </header>
    );
  }

  if (resolvedAlign === 'split') {
    const side = lead || children || aside;
    return (
      <header className={headerClass}>
        {/* The lead's last line sits on the title's last baseline */}
        <div className="grid gap-3 lg:grid-cols-12 lg:items-baseline-last lg:gap-x-6">
          {heading && (
            <div className="grid justify-items-start gap-3 lg:col-span-6">
              {heading}
            </div>
          )}
          {side && (
            <div className="grid justify-items-start gap-3 lg:col-span-6 lg:col-start-7 lg:justify-self-end">
              {lead}
              {children}
              {aside}
            </div>
          )}
        </div>
      </header>
    );
  }

  const body = (
    <div className="grid justify-items-start gap-3">
      {heading}
      {lead}
      {children}
    </div>
  );

  return (
    <header className={headerClass}>
      {aside ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          {body}
          <div className="lg:justify-self-end">{aside}</div>
        </div>
      ) : (
        body
      )}
    </header>
  );
};

export default SectionTitle;
