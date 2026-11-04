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
import IndexRow from './IndexRow';

type Props = {
  fragment: FragmentOf<typeof FeaturedPostsSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  as?: SectionHeadingLevel;
};

/** `minimalist_grid`: a sticky head beside a hairline list of post rows */
const IndexListPosts = ({ fragment, globalPageProps, as = 'h2' }: Props) => {
  const headingId = useId();
  const {
    featuredPostsHeader: title,
    featuredPostsSubheader: subtitle,
    featuredPosts: posts,
  } = readFragment(FeaturedPostsSectionFragment, fragment);

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
      <div className="container-page grid gap-y-8 max-md:gap-y-6 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:col-span-4 lg:self-start">
          <SectionTitle
            id={headingId}
            title={title}
            paragraph={subtitle}
            align="left"
            as={as}
            gap="none"
            className="lg:[--lead-max:46ch]"
          />
        </div>

        <ul className="cells reveal grid-cols-1 lg:col-span-8">
          {posts.map((post, index) => (
            <li key={post.id}>
              <IndexRow
                fragment={post}
                globalPageProps={globalPageProps}
                index={index}
                count={posts.length}
                headingLevel={itemHeadingLevel(as)}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default IndexListPosts;
