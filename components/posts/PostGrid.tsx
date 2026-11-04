import type { FragmentOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import type { ItemHeadingLevel } from '@/utils/headingLevel';
import PostExcerpt from './PostExcerpt';
import type { PostExcerptFragment } from './PostExcerpt/fragment';

type Props = {
  posts: (FragmentOf<typeof PostExcerptFragment> & { id: string })[];
  globalPageProps: ResolvedGlobalPageProps;
  /** Card title level: h3 under a section h2 (default), h2 right under the page h1 */
  headingLevel?: ItemHeadingLevel;
  /** Load the first row's covers eagerly (a grid at the top of the page) */
  prioritizeFirstRow?: boolean;
  className?: string;
};

/**
 * Card layout for position `index` of `count` in the 1 → 2 → 3 column grid:
 * the first card stays a full card on phones, the rest become rows, and an
 * odd last card spans the 2-up tablet grid.
 */
const postCardLayout = (index: number, count: number) => ({
  phoneRow: index > 0,
  tabletWide: index === count - 1 && count % 2 === 1,
});

/** Post cards in a 1 → 2 → 3 column grid */
const PostGrid = ({
  posts,
  globalPageProps,
  headingLevel,
  prioritizeFirstRow = false,
  className,
}: Props) => (
  <div
    className={cn(
      'grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3',
      className,
    )}
  >
    {posts.map((post, index) => (
      <PostExcerpt
        key={post.id}
        fragment={post}
        globalPageProps={globalPageProps}
        priority={prioritizeFirstRow && index < 3}
        headingLevel={headingLevel}
        {...postCardLayout(index, posts.length)}
      />
    ))}
  </div>
);

export default PostGrid;
