import { splitHeading } from '@/utils/headings';

type Props = {
  /** Raw CMS string (keep the stega payload: it stays in the second part) */
  text: string;
  /** Where the first part ends its line: always, from md up, or never (default) */
  lineBreak?: 'always' | 'md' | 'never';
};

const LINE_BREAK_CLASS = {
  always: 'block',
  md: 'md:block',
  never: undefined,
} as const;

/**
 * Two-tone heading text: the first part in the heading's own colour (ink),
 * the second in ink-2. Renders a fragment, never the heading tag, so callers
 * keep their own tag, size and Content Link wrapper.
 *
 * Put `data-datocms-content-link-group` on your heading tag: the stega payload
 * stays at the end of the second part, so without the group only the ink-2
 * half opens the editor.
 */
const TwoTone = ({ text, lineBreak = 'never' }: Props) => {
  const [first, second] = splitHeading(text);

  if (!second) {
    return <>{text}</>;
  }

  return (
    <>
      <span className={LINE_BREAK_CLASS[lineBreak]}>{first}</span>{' '}
      <span className="text-ink-2">{second}</span>
    </>
  );
};

export default TwoTone;
