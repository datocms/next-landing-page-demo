import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import type { OutlineHeading } from '@/utils/headingOutline';

type Props = {
  headings: OutlineHeading[];
  /** Site locale for the "On this page" label (English when missing) */
  locale?: string | null;
  /** Placement (grid column, visibility) */
  className?: string;
};

/**
 * "On this page": a sticky hairline rail of in-page links to the h2 sections,
 * used by docs and legal pages. A long outline scrolls inside the rail, so its
 * last entries stay reachable under the header.
 */
const TableOfContents = ({ headings, locale, className }: Props) => {
  const label = uiString(locale, 'onThisPage');

  return (
    <nav
      aria-label={label}
      className={cn(
        'lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:max-h-[calc(100dvh-var(--header-h)-4rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain',
        className,
      )}
    >
      <p className="label">{label}</p>
      <ol className="mt-4 border-s border-line">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="-ms-px flex items-center border-s-2 border-transparent py-1.5 ps-3.5 text-[0.875rem]/[1.4] text-ink-2 transition-colors duration-150 hover:border-line-strong hover:text-ink focus-visible:-outline-offset-2 pointer-coarse:min-h-11 pointer-coarse:py-3"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default TableOfContents;
