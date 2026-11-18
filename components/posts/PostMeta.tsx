import type { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import AppLink from '@/components/ui/AppLink';
import Avatar, { type AvatarSize } from '@/components/ui/Avatar';
import { fieldEditUrl } from '@/lib/datocms/contentLink';
import type { FragmentOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatDate';

export type PostAuthor = {
  name: string;
  picture?: {
    responsiveImage?: FragmentOf<typeof ResponsiveImageFragment> | null;
  } | null;
};

/** A post's date as a <time>, in the page's language */
export const PostDate = ({
  date,
  locale,
  source,
  className,
}: {
  date: string;
  locale: string;
  /** The post's title: in Draft Mode the date opens the post (it is a publication date, not a field) */
  source?: string;
  className?: string;
}) => {
  const { iso, label } = formatDate(date, locale);
  return (
    <time
      dateTime={iso}
      data-datocms-content-link-url={fieldEditUrl(source)}
      className={cn('whitespace-nowrap', className)}
    >
      {label}
    </time>
  );
};

/** The author's avatar and name; with `href` the name links to the author page */
export const Byline = ({
  author,
  href,
  size = 24,
  className,
}: {
  author: PostAuthor;
  href?: string;
  /** 24 is drawn at 26px, the byline size of every post listing */
  size?: AvatarSize;
  className?: string;
}) => {
  const content = (
    <>
      <Avatar
        image={author.picture?.responsiveImage}
        name={author.name}
        size={size}
        // Avatar has no 26px step: the important size wins over its size-6
        className={size === 24 ? 'size-[26px]!' : undefined}
      />
      <span
        className={cn(
          'min-w-0 font-medium text-fg',
          href &&
            'underline decoration-transparent decoration-1 underline-offset-[3px] transition-colors duration-150 group-hover/byline:decoration-current',
        )}
      >
        {author.name}
      </span>
    </>
  );

  return href ? (
    <AppLink
      href={href}
      className={cn('group/byline inline-flex items-center gap-2', className)}
    >
      {content}
    </AppLink>
  ) : (
    <span className={cn('inline-flex items-center gap-2', className)}>
      {content}
    </span>
  );
};

type Props = {
  locale: string;
  /** Raw CMS date or datetime */
  date?: string | null;
  author?: PostAuthor | null;
  /** The post's title, for the date's Content Link target */
  source?: string;
  /** Placement only */
  className?: string;
};

/**
 * The byline of every post listing: the author's 26px round photo, the name
 * in navy (13.5px medium), then the date, muted. Renders nothing when both are missing.
 */
const PostMeta = ({ locale, date, author, source, className }: Props) => {
  if (!date && !author) return null;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-2 gap-y-1 text-ui text-fg-muted',
        className,
      )}
    >
      {author && <Byline author={author} />}
      {date && <PostDate date={date} locale={locale} source={source} />}
    </div>
  );
};

export default PostMeta;
