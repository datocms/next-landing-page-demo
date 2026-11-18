import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import type { OutlineHeading } from '@/utils/headingOutline';
import TocLinks from './TocLinks';

type Props = {
  headings: OutlineHeading[];
  locale: string;
  /** `rail`: the docs' outline, with a marker gliding along a hairline (see TocLinks) */
  variant?: 'plain' | 'rail';
  /** Placement (grid column, visibility) */
  className?: string;
};

/** Fewer headings than this don't need an "On this page" list */
export const MIN_TOC_HEADINGS = 3;

/**
 * "On this page": in-page links to the h2 sections of a docs or legal page,
 * sticky under the header. The section being read is marked as it scrolls
 * by. A long outline scrolls inside the list, so its last entries stay
 * reachable.
 */
const TableOfContents = ({
  headings,
  locale,
  variant = 'plain',
  className,
}: Props) => {
  const label = uiString(locale, 'onThisPage');

  return (
    <nav
      aria-label={label}
      className={cn(
        'lg:sticky lg:top-[calc(var(--header-h)+2.5rem)] lg:max-h-[calc(100dvh-var(--header-h)-5rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain',
        className,
      )}
    >
      <p className={cn('text-small font-medium', variant === 'rail' && 'mb-3')}>
        {label}
      </p>
      {/* Only the id and the text cross to the client, not the heading nodes */}
      <TocLinks
        items={headings.map(({ id, text }) => ({ id, text }))}
        variant={variant}
        className="mt-2"
      />
    </nav>
  );
};

export default TableOfContents;
