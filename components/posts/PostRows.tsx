import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import type { ItemHeadingLevel } from '@/utils/headingLevel';
import { POST_TITLE } from './PostCard';
import PostCover from './PostCover';
import { PostExcerptFragment } from './PostExcerpt/fragment';
import PostLink, { postPath } from './PostLink';
import PostMeta from './PostMeta';
import PostTags from './PostTags';
import PostTitle from './PostTitle';

type Props = {
  posts: readonly (FragmentOf<typeof PostExcerptFragment> & { id: string })[];
  globalPageProps: ResolvedGlobalPageProps;
  /** Row title level: h3 under a section h2 (default) */
  headingLevel?: ItemHeadingLevel;
  /** Placement only */
  className?: string;
};

const THUMB_SIZES = '(min-width: 640px) 240px, 112px';

/**
 * Posts as rows between hairlines, in the language of the post block: a small
 * 3:2 cover on the left, then the tags as pale pills, the title and the byline.
 * Each row is one link; its title underlines on hover.
 */
const PostRows = ({
  posts,
  globalPageProps,
  headingLevel: Heading = 'h3',
  className,
}: Props) => {
  const { locale } = globalPageProps.params;

  return (
    <ul className={cn('divide-y divide-line', className)}>
      {posts.map((post) => {
        const { id, title, slug, author, tags, coverImage, _publishedAt } =
          readFragment(PostExcerptFragment, post);

        return (
          <li key={id} className="py-6 first:pt-0 last:pb-0 md:py-7">
            <PostLink
              slug={slug}
              globalPageProps={globalPageProps}
              className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-5 sm:grid-cols-[15rem_minmax(0,1fr)] sm:gap-8"
            >
              <PostCover
                linksTo={postPath(slug, globalPageProps)}
                image={coverImage}
                sizes={THUMB_SIZES}
                alt=""
                className="max-sm:rounded-tile"
              />
              <div className="min-w-0">
                <PostTags tags={tags.slice(0, 3)} className="max-sm:hidden" />
                <Heading
                  className={cn(POST_TITLE, 'max-sm:text-[1.125rem] sm:mt-3')}
                >
                  <PostTitle
                    title={title}
                    locale={locale}
                    className="title-underline"
                  />
                </Heading>
                <PostMeta
                  locale={locale}
                  date={_publishedAt}
                  author={author}
                  className="mt-3"
                />
              </div>
            </PostLink>
          </li>
        );
      })}
    </ul>
  );
};

export default PostRows;
