import { useId } from 'react';
import { FeaturedPostsSectionFragment } from '@/components/sections/FeaturedPostsSection/fragment';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import IndexRow from './IndexRow';

type Props = {
  fragment: FragmentOf<typeof FeaturedPostsSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** Pass "h1" when this block opens the page, so its title doubles as the page header */
  as?: 'h1' | 'h2';
};

/**
 * Index list, the quietest variant: a sticky side head and one hairline cell
 * list of rows (thumb, title, byline, chip and date, arrow). Every row is one
 * link; longer lists just add rows.
 */
const IndexList = ({ fragment, globalPageProps, as = 'h2' }: Props) => {
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
            h1Size="section"
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
                // Post titles sit one level under the section head
                headingLevel={as === 'h1' ? 'h2' : 'h3'}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default IndexList;
