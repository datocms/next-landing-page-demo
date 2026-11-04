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
import PhotoCard from './PhotoCard';

type Props = {
  fragment: FragmentOf<typeof FeaturedPostsSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  as?: SectionHeadingLevel;
};

/**
 * `full_image_card`: tall covers, each pinned by a white card with the meta,
 * title and byline, so no text sits on a photo. Below lg the cards scroll
 * sideways.
 */
const PhotoCardPosts = ({ fragment, globalPageProps, as = 'h2' }: Props) => {
  const headingId = useId();
  const {
    featuredPostsHeader: title,
    featuredPostsSubheader: subtitle,
    featuredPosts: posts,
  } = readFragment(FeaturedPostsSectionFragment, fragment);

  return (
    <section
      className="section overflow-x-clip"
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
          align="center"
          as={as}
          className="[--lead-max:560px]"
        />

        {/* No tabIndex on the track: each tile link is a tab stop, and focusing one scrolls it into view.
            The track reveals as one unit: a reveal inside a scroller would stick faint in Safari */}
        <div className="no-scrollbar reveal max-lg:-mx-(--pad) max-lg:snap-x max-lg:snap-mandatory max-lg:scroll-px-(--pad) max-lg:overflow-x-auto max-lg:px-(--pad)">
          <ul className="grid gap-4 max-lg:flex max-lg:w-max max-lg:gap-3 lg:grid-cols-3">
            {posts.map((post) => (
              <li
                key={post.id}
                className="max-lg:w-[300px] max-lg:shrink-0 max-lg:snap-start md:max-lg:w-[320px]"
              >
                <PhotoCard
                  fragment={post}
                  globalPageProps={globalPageProps}
                  headingLevel={itemHeadingLevel(as)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PhotoCardPosts;
