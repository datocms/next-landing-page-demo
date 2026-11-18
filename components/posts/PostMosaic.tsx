import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import type { ItemHeadingLevel } from '@/utils/headingLevel';
import PostCard, { POST_TITLE } from './PostCard';
import PostCover from './PostCover';
import { PostExcerptFragment } from './PostExcerpt/fragment';
import { CARD_COVER_SIZES } from './PostGrid';
import PostLink, { postPath } from './PostLink';
import PostMeta from './PostMeta';
import PostTags from './PostTags';
import PostTitle from './PostTitle';
import { postExcerptEditUrl, postExcerptText } from './postExcerptText';

type Post = FragmentOf<typeof PostExcerptFragment> & { id: string };

type Props = {
  posts: readonly Post[];
  globalPageProps: ResolvedGlobalPageProps;
  /** Card title level: h2 right under the page h1 (default), h3 under a section h2 */
  headingLevel?: ItemHeadingLevel;
  /** Load the first row's covers eagerly (a grid at the top of the page) */
  prioritizeFirstRow?: boolean;
  /** Leave the author out of the meta (the author's own page) */
  hideAuthor?: boolean;
  /** Placement only */
  className?: string;
};

/**
 * Every fifth post is wide from 1024px: a row of three post blocks, then a
 * row of a wide one and a block, then three, then a block and a wide one…
 */
const CYCLE = 5;

/**
 * The wide post's cover: at most 600px wide from 1024px, but drawn as tall as
 * the row, which crops a 16:10 image to about square. Below 1024 it is a block.
 */
const WIDE_COVER_SIZES = `(min-width: 1024px) 600px, ${CARD_COVER_SIZES}`;

/** A post that spans two columns from 1024px (below, the usual post block) */
const WidePost = ({
  post,
  globalPageProps,
  headingLevel: Heading,
  hideAuthor,
  coverLast,
  full,
}: {
  post: Post;
  globalPageProps: ResolvedGlobalPageProps;
  headingLevel: ItemHeadingLevel;
  hideAuthor: boolean;
  /** The cover on the right (every other wide post) */
  coverLast: boolean;
  /** All three columns: a last post that would otherwise sit alone in its row */
  full: boolean;
}) => {
  const { locale } = globalPageProps.params;
  const {
    title,
    slug,
    seoMeta,
    coverImage,
    author,
    tags,
    content,
    _publishedAt,
  } = readFragment(PostExcerptFragment, post);
  const excerpt = postExcerptText(title, seoMeta?.description, content);

  return (
    <article
      className={cn('lg:tile lg:p-3', full ? 'lg:col-span-3' : 'lg:col-span-2')}
    >
      <PostLink
        slug={slug}
        globalPageProps={globalPageProps}
        className={cn(
          'flex h-full flex-col lg:grid lg:items-center lg:gap-x-8',
          full
            ? 'lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]'
            : 'lg:grid-cols-2',
        )}
      >
        <PostCover
          linksTo={postPath(slug, globalPageProps)}
          image={coverImage}
          sizes={WIDE_COVER_SIZES}
          alt=""
          // From 1024 the cover fills the tile's height (the important wins over 3:2)
          className={cn(
            'lg:aspect-auto! lg:h-full',
            full ? 'lg:min-h-80' : 'lg:min-h-64',
            coverLast && 'lg:order-last',
          )}
        />
        <div
          className={cn(
            'flex flex-col lg:py-6',
            coverLast ? 'lg:pl-5' : 'lg:pr-5',
          )}
        >
          <PostTags
            tags={tags.slice(0, 3)}
            className="mt-5 lg:mt-0 lg:[&>li]:bg-surface"
          />
          <Heading
            className={cn(
              'mt-3',
              POST_TITLE,
              'lg:text-[1.75rem] lg:leading-[1.15] lg:tracking-[-0.04em]',
            )}
          >
            <PostTitle
              title={title}
              locale={locale}
              className="title-underline"
            />
          </Heading>
          {excerpt && (
            <p
              data-datocms-content-link-url={postExcerptEditUrl(
                title,
                seoMeta?.description,
              )}
              className="mt-3 line-clamp-3 text-body text-fg-muted max-lg:hidden"
            >
              {excerpt}
            </p>
          )}
          <PostMeta
            locale={locale}
            date={_publishedAt}
            source={title}
            author={hideAuthor ? null : author}
            className="mt-3.5 lg:mt-5"
          />
        </div>
      </PostLink>
    </article>
  );
};

/**
 * The blog's post grid with a rhythm: post blocks three to a row (two from
 * 768, one on phones), and from 1024px every fifth post as a wide pale tile
 * with its excerpt, alternating sides. A last post that would sit alone in
 * its row from 1024px spans the whole row as the same tile.
 */
const PostMosaic = ({
  posts,
  globalPageProps,
  headingLevel = 'h2',
  prioritizeFirstRow = false,
  hideAuthor = false,
  className,
}: Props) => {
  const layout = posts.map((_, index) => {
    const cycle = Math.floor(index / CYCLE);
    const place = index % CYCLE;
    // Fourth of a cycle: the wide one first; fifth: the wide one second
    const wideIndex = cycle % 2 === 0 ? 3 : 4;
    const wide =
      place === wideIndex &&
      // Its row partner has to exist
      (wideIndex === 3 ? index + 1 < posts.length : true);
    return { wide, coverLast: cycle % 2 === 1 };
  });
  const slots = layout.reduce((sum, { wide }) => sum + (wide ? 2 : 1), 0);
  // One post alone in the last row (a block, never a wide one)
  const lastAlone = posts.length > 1 && slots % 3 === 1;

  return (
    <div
      className={cn(
        'grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-14',
        className,
      )}
    >
      {posts.map((post, index) => {
        const full = lastAlone && index === posts.length - 1;
        const { wide, coverLast } = layout[index];

        return wide || full ? (
          <WidePost
            key={post.id}
            post={post}
            globalPageProps={globalPageProps}
            headingLevel={headingLevel}
            hideAuthor={hideAuthor}
            coverLast={coverLast}
            full={full}
          />
        ) : (
          <PostCard
            key={post.id}
            fragment={post}
            globalPageProps={globalPageProps}
            sizes={CARD_COVER_SIZES}
            priority={prioritizeFirstRow && index < 3}
            headingLevel={headingLevel}
            hideAuthor={hideAuthor}
          />
        );
      })}
    </div>
  );
};

export default PostMosaic;
