import type { PostExcerptFragment } from '@/components/posts/PostExcerpt/fragment';
import type { FragmentOf } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import type { ItemHeadingLevel } from '@/utils/headingLevel';

/** What every layout of the featured posts block receives (at least one post) */
export type VariantProps = {
  posts: readonly (FragmentOf<typeof PostExcerptFragment> & { id: string })[];
  globalPageProps: ResolvedGlobalPageProps;
  headingLevel: ItemHeadingLevel;
};
