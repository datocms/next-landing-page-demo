import type { FragmentOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import type { ItemHeadingLevel } from '@/utils/headingLevel';
import PostCard from './PostCard';
import type { PostExcerptFragment } from './PostExcerpt/fragment';

type Props = {
  posts: readonly (FragmentOf<typeof PostExcerptFragment> & { id: string })[];
  globalPageProps: ResolvedGlobalPageProps;
  /** Card title level: h3 under a section h2 (default), h2 right under the page h1 */
  headingLevel?: ItemHeadingLevel;
  /** Load the first row's covers eagerly (a grid at the top of the page) */
  prioritizeFirstRow?: boolean;
  /** Leave the author out of the meta (the author's own page) */
  hideAuthor?: boolean;
  /** Placement only */
  className?: string;
};

/**
 * One post per row on phones, two from 768, three from 1024. The 16:10 image
 * fills a 3:2 frame, so it is drawn about 7% wider than the frame: the sizes
 * say so, or the browser picks a candidate a little too small.
 */
export const CARD_COVER_SIZES =
  '(min-width: 1264px) 384px, (min-width: 1024px) calc((100vw - 136px) / 3 * 1.07), (min-width: 768px) calc((100vw - 76px) / 2 * 1.07), calc((100vw - 40px) * 1.07)';

/** Post blocks on a three-column grid, 28px apart (more air between rows) */
const PostGrid = ({
  posts,
  globalPageProps,
  headingLevel,
  prioritizeFirstRow = false,
  hideAuthor = false,
  className,
}: Props) => (
  <div
    className={cn(
      'grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-14',
      className,
    )}
  >
    {posts.map((post, index) => (
      <PostCard
        key={post.id}
        fragment={post}
        globalPageProps={globalPageProps}
        sizes={CARD_COVER_SIZES}
        priority={prioritizeFirstRow && index < 3}
        headingLevel={headingLevel}
        hideAuthor={hideAuthor}
      />
    ))}
  </div>
);

export default PostGrid;
