import { uiString } from '@/lib/i18n/uiStrings';
import { hasText } from './postText';

type Props = {
  /** Raw CMS title */
  title?: string | null;
  locale: string;
  /** On the title text only: `title-underline` inside a linked row or card */
  className?: string;
};

/**
 * A post's title as the text of a heading, or a muted "Untitled" when the
 * post has none, so a list never shows an empty gap
 */
const PostTitle = ({ title, locale, className }: Props) =>
  hasText(title) ? (
    <span className={className}>{title}</span>
  ) : (
    <span className="text-fg-muted">{uiString(locale, 'untitled')}</span>
  );

export default PostTitle;
