import { stripStega } from '@datocms/content-link';
import AppLink from '@/components/ui/AppLink';
import { cn } from '@/utils/cn';
import { hasText } from './postText';

/**
 * The pale pill of a post's tag (and of an author's areas): the subtle tint, the
 * accent as text, 12.5px semibold. Always one line: a tag wider than its row is cut
 * with an ellipsis rather than wrapped
 */
export const tagPillClass =
  'inline-block min-h-6 max-w-full truncate rounded-chip bg-subtle px-2.5 py-1 text-[0.78125rem] leading-4 font-semibold text-accent-ink';

/** A linked pill: the tint deepens on hover, the hit area is 44px (so it is not
    clipped: one line, but no ellipsis) */
export const tagPillLinkClass =
  'hit-44 inline-block min-h-6 whitespace-nowrap rounded-chip bg-subtle px-2.5 py-1 text-[0.78125rem] leading-4 font-semibold text-accent-ink transition-colors duration-150 hover:bg-tint';

type Props = {
  tags: readonly { name: string }[];
  /** White pills, for a post on a tinted panel or tile */
  onTint?: boolean;
  /** Placement only */
  className?: string;
};

/** On a tinted panel the pale pill would vanish: white instead (important, cn does not merge) */
const ON_TINT = 'bg-surface!';

/** A post's tags as pale pills, not linked (inside a card that is one link) */
const PostTags = ({ tags, onTint = false, className }: Props) => {
  const names = tags.map((tag) => tag.name).filter(hasText);
  if (names.length === 0) return null;

  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)}>
      {names.map((name) => (
        <li
          key={stripStega(name)}
          className={cn(tagPillClass, onTint && ON_TINT)}
        >
          {name}
        </li>
      ))}
    </ul>
  );
};

/** A tag pill linking to its tag page */
export const TagPillLink = ({
  href,
  children,
}: {
  href: string;
  children: string;
}) => (
  <AppLink href={href} className={tagPillLinkClass}>
    {children}
  </AppLink>
);

export default PostTags;
