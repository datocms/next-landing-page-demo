import Link from 'next/link';
import AuthorAvatar from '@/components/posts/AuthorAvatar';
import PostCover from '@/components/posts/PostCover';
import PostMeta from '@/components/posts/PostMeta';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import type { ItemHeadingLevel } from '@/utils/headingLevel';
import { authorUrl, postUrl } from '@/utils/routes';
import { PostExcerptFragment } from './fragment';

type Props = {
  fragment: FragmentOf<typeof PostExcerptFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** Below 768: a compact row with a 96px square thumb instead of a full card */
  phoneRow?: boolean;
  /** 768–1023: span both columns, image left and copy right (the odd last card of a 2-up grid) */
  tabletWide?: boolean;
  /** Load the cover eagerly (cards above the fold on index pages) */
  priority?: boolean;
  /** Title level: h3 under a section h2 (default), h2 when the grid sits right under the page h1 */
  headingLevel?: ItemHeadingLevel;
};

/** Cover widths of a card in the 1 → 2 → 3 column grid */
const CARD_COVER_SIZES =
  '(min-width: 1024px) 372px, (min-width: 768px) 50vw, 100vw';
/** Same, but a phone row shows a 96px square thumb below 768 */
const PHONE_ROW_COVER_SIZES =
  '(min-width: 1024px) 372px, (min-width: 768px) 50vw, 96px';

/**
 * A post card: cover, tag chip and date, title and byline. The title link
 * stretches over the whole card; the author link sits above it as its own tab
 * stop.
 */
const PostExcerpt = ({
  fragment,
  globalPageProps,
  phoneRow = false,
  tabletWide = false,
  priority = false,
  headingLevel: Heading = 'h3',
}: Props) => {
  const { title, seoTags, author, tags, _publishedAt, slug } = readFragment(
    PostExcerptFragment,
    fragment,
  );

  const cover = seoTags?.image?.responsiveImage;
  const avatar = author?.picture?.responsiveImage;
  const coverSizes = phoneRow ? PHONE_ROW_COVER_SIZES : CARD_COVER_SIZES;

  return (
    <article
      className={cn(
        'card card-hover group flex flex-col p-2',
        tabletWide &&
          'md:max-lg:col-span-2 md:max-lg:grid md:max-lg:grid-cols-2 md:max-lg:items-start md:max-lg:gap-x-4',
        phoneRow &&
          'max-md:grid max-md:grid-cols-[96px_minmax(0,1fr)] max-md:items-center max-md:gap-x-3.5',
      )}
    >
      <div
        className={cn(
          'photo aspect-[16/10] rounded-zone',
          phoneRow && 'max-md:aspect-square max-md:rounded-xl',
        )}
      >
        <PostCover
          cover={cover}
          title={title}
          sizes={coverSizes}
          priority={priority}
        />
      </div>

      <div
        className={cn(
          'flex flex-1 flex-col px-3.5 pt-4 pb-[18px]',
          phoneRow && 'max-md:py-1 max-md:pr-1.5 max-md:pl-0',
        )}
      >
        <PostMeta tag={tags[0]?.tag} date={_publishedAt} />

        <Heading
          className={cn(
            'mt-2.5 text-h3 leading-[1.35] text-ink md:min-h-[2.7em]',
            phoneRow && 'max-md:mt-2 max-md:text-base',
          )}
        >
          {/* The link is a flex box so its ::after overlay stays out of the title's line box: Chrome only applies text-wrap: pretty to plain inline content */}
          <Link
            href={postUrl(globalPageProps, slug)}
            className="stretched-link flex underline decoration-transparent decoration-1 underline-offset-[3px] transition-[text-decoration-color] duration-200 [--stretched-offset:3px] [--stretched-radius:19px] group-hover:decoration-current"
          >
            <span className="line-clamp-3 text-pretty">{title}</span>
          </Link>
        </Heading>

        {author && (
          <Link
            href={authorUrl(globalPageProps, author.slug)}
            className={cn(
              'hit-44 z-10 mt-3 inline-flex w-fit items-center gap-2 rounded-full pr-1 text-meta text-ink-2 transition-colors duration-150 hover:text-ink',
              phoneRow && 'max-md:mt-2',
            )}
          >
            {avatar && (
              <AuthorAvatar
                image={avatar}
                sizes="24px"
                className="size-6 shrink-0"
              />
            )}
            {author.name}
          </Link>
        )}
      </div>
    </article>
  );
};

export default PostExcerpt;
