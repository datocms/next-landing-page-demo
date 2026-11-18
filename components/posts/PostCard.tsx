import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import type { ItemHeadingLevel } from '@/utils/headingLevel';
import PostCover from './PostCover';
import { PostExcerptFragment } from './PostExcerpt/fragment';
import PostLink, { postPath } from './PostLink';
import PostMeta from './PostMeta';
import PostTags from './PostTags';
import PostTitle from './PostTitle';
import { postExcerptText } from './postExcerptText';

export type PostCardVariant = 'card' | 'featured' | 'small';

type Props = {
  fragment: FragmentOf<typeof PostExcerptFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /**
   * card: the post block of every listing (cover, tags, title, byline).
   * featured: the large post of the `featured` layout (larger title and an excerpt).
   * small: the posts beside the featured one (two tags at most)
   */
  variant?: PostCardVariant;
  /** The cover's HTML `sizes` */
  sizes: string;
  /** Load the cover eagerly (the first row of a list page) */
  priority?: boolean;
  /** The title's tag: h3 under a section h2, h2 under a page h1 */
  headingLevel?: ItemHeadingLevel;
  /** Leave the author out of the meta (the author's own page) */
  hideAuthor?: boolean;
  /** Placement only */
  className?: string;
};

/** At most this many tags show on a post block */
const MAX_TAGS = 3;

/** The item title of a post block: 22px, tight */
export const POST_TITLE =
  'text-[1.375rem] leading-[1.22] font-semibold tracking-[-0.035em]';

/**
 * The post block: no border, no fill. The 3:2 cover with the media radius, then
 * the tags as pale pills, the title and the byline (26px photo, name, date).
 * The whole block is one link; its title underlines on hover.
 */
const PostCard = ({
  fragment,
  globalPageProps,
  variant = 'card',
  sizes,
  priority = false,
  headingLevel: Heading = 'h3',
  hideAuthor = false,
  className,
}: Props) => {
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
  } = readFragment(PostExcerptFragment, fragment);
  const featured = variant === 'featured';
  const small = variant === 'small';
  const excerpt = featured
    ? postExcerptText(title, seoMeta?.description, content)
    : null;

  return (
    <article className={className}>
      <PostLink
        slug={slug}
        globalPageProps={globalPageProps}
        className="flex h-full flex-col"
      >
        <PostCover
          linksTo={postPath(slug, globalPageProps)}
          image={coverImage}
          sizes={sizes}
          priority={priority}
          alt=""
        />
        <div className="flex flex-col">
          <PostTags
            tags={tags.slice(0, small ? 2 : MAX_TAGS)}
            className="mt-5"
          />
          <Heading
            className={cn(
              'mt-3',
              featured
                ? 'max-w-[30ch] text-[1.625rem] leading-[1.15] font-semibold tracking-[-0.04em] lg:text-[2rem]'
                : POST_TITLE,
            )}
          >
            <PostTitle
              title={title}
              locale={locale}
              className="title-underline"
            />
          </Heading>
          {excerpt && (
            <p className="mt-3 line-clamp-3 max-w-[60ch] text-body text-fg-muted">
              {excerpt}
            </p>
          )}
          <PostMeta
            locale={locale}
            date={_publishedAt}
            author={hideAuthor ? null : author}
            className={featured ? 'mt-5' : 'mt-3.5'}
          />
        </div>
      </PostLink>
    </article>
  );
};

export default PostCard;
