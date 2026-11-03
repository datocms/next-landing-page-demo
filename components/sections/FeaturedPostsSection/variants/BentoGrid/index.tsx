import { useId } from 'react';
import { FeaturedPostsSectionFragment } from '@/components/sections/FeaturedPostsSection/fragment';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import LeadTile from './LeadTile';
import SideTile from './SideTile';

type Props = {
  fragment: FragmentOf<typeof FeaturedPostsSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** Pass "h1" when this block opens the page, so its title doubles as the page header */
  as?: 'h1' | 'h2';
};

/**
 * Bento: tinted tiles on a hairline, no shadows. The lead post takes two
 * columns and two rows with a tall cover and a byline pin; the next posts
 * stack in the third column, and any further posts continue as tiles below
 * (a short last row widens to fill it).
 */
const BentoGrid = ({ fragment, globalPageProps, as = 'h2' }: Props) => {
  const headingId = useId();
  const {
    featuredPostsHeader: title,
    featuredPostsSubheader: subtitle,
    featuredPosts: posts,
  } = readFragment(FeaturedPostsSectionFragment, fragment);

  const [leadPost, ...sidePosts] = posts;

  if (!leadPost) {
    return null;
  }

  // Post titles sit one level under the section head
  const headingLevel = as === 'h1' ? 'h2' : 'h3';

  return (
    <section
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

        <div className="reveal-stagger grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-6">
          <LeadTile
            fragment={leadPost}
            globalPageProps={globalPageProps}
            sideCount={sidePosts.length}
            headingLevel={headingLevel}
          />
          {sidePosts.map((post, index) => (
            <SideTile
              key={post.id}
              fragment={post}
              globalPageProps={globalPageProps}
              index={index}
              sideCount={sidePosts.length}
              headingLevel={headingLevel}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
