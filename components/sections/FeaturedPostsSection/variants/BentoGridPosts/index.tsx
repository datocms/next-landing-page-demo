import { useId } from 'react';
import { FeaturedPostsSectionFragment } from '@/components/sections/FeaturedPostsSection/fragment';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import {
  itemHeadingLevel,
  type SectionHeadingLevel,
} from '@/utils/headingLevel';
import LeadTile from './LeadTile';
import SideTile from './SideTile';

type Props = {
  fragment: FragmentOf<typeof FeaturedPostsSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  as?: SectionHeadingLevel;
};

/**
 * `modern_cards`: the lead post in a large tile with a byline pin, the next
 * ones in smaller tiles beside and below it.
 */
const BentoGridPosts = ({ fragment, globalPageProps, as = 'h2' }: Props) => {
  const headingId = useId();
  const {
    featuredPostsHeader: title,
    featuredPostsSubheader: subtitle,
    featuredPosts: posts,
  } = readFragment(FeaturedPostsSectionFragment, fragment);

  const [leadPost, ...sidePosts] = posts;
  const headingLevel = itemHeadingLevel(as);

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

export default BentoGridPosts;
