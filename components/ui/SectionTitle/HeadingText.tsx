import { cn } from '@/utils/cn';
import type { twoToneHeading } from '@/utils/headings';
import TwoTone from './TwoTone';

type Props = {
  title: string;
  lead?: string | null;
  isPageTitle: boolean;
  /** twoToneHeading's verdict: null when the title and lead stay apart */
  merged: NonNullable<ReturnType<typeof twoToneHeading>> | null;
};

/** A merged lead on its own line; below 768 it also switches to the lead's own type */
const STACKED_LEAD =
  'block max-md:mt-2 max-md:font-sans max-md:text-lead max-md:tracking-[-0.005em]';

/**
 * What goes inside the heading tag: the two-tone page title, the title
 * merged with its lead, or the title alone
 */
const HeadingText = ({ title, lead, isPageTitle, merged }: Props) => {
  if (isPageTitle) return <TwoTone text={title} />;
  if (!merged) return title;

  // Title and lead stay separate text nodes, so both keep their stega
  return (
    <>
      {title}
      {merged.joiner === '. ' ? '.' : ''}{' '}
      <span
        className={cn('text-ink-2', merged.stack && STACKED_LEAD)}
        data-datocms-content-link-boundary
      >
        {lead}
      </span>
    </>
  );
};

export default HeadingText;
