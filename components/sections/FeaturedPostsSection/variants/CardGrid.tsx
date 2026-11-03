import { useId } from 'react';
import PostExcerpt, { postCardLayout } from '@/components/posts/PostExcerpt';
import { FeaturedPostsSectionFragment } from '@/components/sections/FeaturedPostsSection/fragment';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

type Props = {
  fragment: FragmentOf<typeof FeaturedPostsSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** Pass "h1" when this block opens the page, so its title doubles as the page header */
  as?: 'h1' | 'h2';
};

/**
 * Card grid (the default): a split head over three white post cards. On
 * tablets the odd last card spans both columns; on phones every card after
 * the first becomes a compact row.
 */
const CardGrid = ({ fragment, globalPageProps, as = 'h2' }: Props) => {
  const headingId = useId();
  const {
    featuredPostsHeader: title,
    featuredPostsSubheader: subtitle,
    featuredPosts: posts,
  } = readFragment(FeaturedPostsSectionFragment, fragment);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      id="blog"
      className="section"
      aria-labelledby={title ? headingId : undefined}
      aria-label={
        title
          ? undefined
          : uiString(globalPageProps.params.locale, 'featuredPosts')
      }
    >
      <div className="container-page">
        <SectionTitle
          id={headingId}
          title={title}
          paragraph={subtitle}
          align="split"
          as={as}
          h1Size="section"
        />

        <div className="reveal-stagger grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {posts.map((post, index) => (
            <PostExcerpt
              key={post.id}
              fragment={post}
              globalPageProps={globalPageProps}
              headingLevel={as === 'h1' ? 'h2' : 'h3'}
              {...postCardLayout(index, posts.length)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardGrid;
