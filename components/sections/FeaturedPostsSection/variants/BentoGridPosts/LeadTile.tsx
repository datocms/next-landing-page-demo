import Link from 'next/link';
import AuthorAvatar from '@/components/posts/AuthorAvatar';
import { isRedundantExcerpt } from '@/components/posts/isRedundantExcerpt';
import PostCover from '@/components/posts/PostCover';
import { PostExcerptFragment } from '@/components/posts/PostExcerpt/fragment';
import PostMeta from '@/components/posts/PostMeta';
import {
  type FragmentOf,
  type ResultOf,
  readFragment,
} from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import type { ItemHeadingLevel } from '@/utils/headingLevel';
import { authorUrl } from '@/utils/routes';
import TileTitleLink from './TileTitleLink';

type Author = NonNullable<ResultOf<typeof PostExcerptFragment>['author']>;

type Props = {
  fragment: FragmentOf<typeof PostExcerptFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** How many side tiles follow the lead: its span and cover shape depend on it */
  sideCount: number;
  headingLevel: ItemHeadingLevel;
};

type AuthorPinProps = {
  author: Author;
  globalPageProps: ResolvedGlobalPageProps;
};

/**
 * The lg grid has 6 tracks so a trailing row can split in halves; a regular
 * tile spans 2 (three to a row). Lead placement, by how many side tiles follow it.
 */
const leadSpan = (sideCount: number) => {
  if (sideCount === 0) return 'md:col-span-2 lg:col-span-6';
  if (sideCount === 1) return 'md:col-span-2 lg:col-span-4';
  return 'md:col-span-2 lg:col-span-4 lg:row-span-2';
};

/** The byline pinned to the cover's bottom corner, linking to the author page */
const AuthorPin = ({ author, globalPageProps }: AuthorPinProps) => {
  const avatar = author.picture?.responsiveImage;

  return (
    <Link
      href={authorUrl(globalPageProps, author.slug)}
      className="float absolute bottom-3 left-3 z-10 inline-flex h-10 max-w-[calc(100%-24px)] items-center gap-2 rounded-full ps-1 pe-4 text-meta font-medium text-ink transition-colors duration-150 hover:bg-well max-md:h-9 pointer-coarse:h-11"
    >
      {avatar && (
        <AuthorAvatar
          image={avatar}
          sizes="32px"
          className="size-8 shrink-0 max-md:size-7"
        />
      )}
      <span className="truncate">{author.name}</span>
    </Link>
  );
};

/**
 * The lead post's tile: a tall cover with a byline pin, then the meta, the
 * title and the description
 */
const LeadTile = ({
  fragment,
  globalPageProps,
  sideCount,
  headingLevel: Heading,
}: Props) => {
  const post = readFragment(PostExcerptFragment, fragment);
  const description = post.seoTags?.description;
  // Beside two or more side tiles the lead spans two rows and its cover grows to fill them
  const spansTwoRows = sideCount > 1;

  return (
    <article
      className={cn(
        'group relative flex flex-col rounded-card border border-line bg-well p-2',
        leadSpan(sideCount),
      )}
    >
      {/* The byline pin sits beside the photo (not inside its isolated box), so it stays above the stretched title link */}
      <div
        className={cn(
          'relative flex flex-col',
          spansTwoRows && 'lg:min-h-[320px] lg:flex-1',
        )}
      >
        <div
          className={cn(
            'photo aspect-[16/9] rounded-xl md:aspect-[2/1]',
            // A lone post spans the full row: a wider frame keeps the cover under 520px tall
            sideCount === 0 && 'lg:aspect-[21/9]',
            spansTwoRows && 'lg:aspect-auto lg:flex-1',
          )}
        >
          <PostCover
            cover={post.seoTags?.image?.responsiveImage}
            title={post.title}
            sizes="(min-width: 1024px) 780px, 100vw"
          />
        </div>

        {post.author && (
          <AuthorPin author={post.author} globalPageProps={globalPageProps} />
        )}
      </div>

      <div className="px-4 pt-5 pb-4 max-md:px-2.5 max-md:pt-4 max-md:pb-2.5">
        <PostMeta tag={post.tags[0]?.tag} date={post._publishedAt} />
        <Heading className="mt-3 max-w-[36ch] text-h3-lg text-ink">
          <TileTitleLink
            title={post.title}
            slug={post.slug}
            globalPageProps={globalPageProps}
          />
        </Heading>
        {description && !isRedundantExcerpt(post.title, description) && (
          <p className="mt-2 line-clamp-2 max-w-[60ch] text-body text-ink-2">
            {description}
          </p>
        )}
      </div>
    </article>
  );
};

export default LeadTile;
