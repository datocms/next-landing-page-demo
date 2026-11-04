import { useId } from 'react';
import { isRedundantExcerpt } from '@/components/posts/isRedundantExcerpt';
import { PostExcerptFragment } from '@/components/posts/PostExcerpt/fragment';
import { FeaturedPostsSectionFragment } from '@/components/sections/FeaturedPostsSection/fragment';
import { Threads } from '@/components/ui/Ornaments';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import {
  itemHeadingLevel,
  type SectionHeadingLevel,
} from '@/utils/headingLevel';
import { authorUrl, postUrl } from '@/utils/routes';
import SpotlightSlides from './SpotlightSlides';
import { spotlightShape } from './spotlightShape';
import type { SpotlightLabels, SpotlightPost } from './types';

type Props = {
  fragment: FragmentOf<typeof FeaturedPostsSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  as?: SectionHeadingLevel;
};

/** Resolves a post fragment into the plain object the client island takes */
const toSpotlightPost = (
  fragment: FragmentOf<typeof PostExcerptFragment>,
  globalPageProps: ResolvedGlobalPageProps,
): SpotlightPost => {
  const post = readFragment(PostExcerptFragment, fragment);
  return {
    id: post.id,
    title: post.title,
    href: postUrl(globalPageProps, post.slug),
    tag: post.tags[0]?.tag ?? null,
    date: post._publishedAt ?? null,
    // Hide a description that only repeats the title
    description: isRedundantExcerpt(post.title, post.seoTags?.description)
      ? null
      : (post.seoTags?.description ?? null),
    cover: post.seoTags?.image?.responsiveImage ?? null,
    author: post.author
      ? {
          name: post.author.name,
          bio: post.author.bio ?? null,
          href: authorUrl(globalPageProps, post.author.slug),
          picture: post.author.picture?.responsiveImage ?? null,
        }
      : null,
  };
};

/**
 * `carrousel` (or `carousel`): one post at a time in a tinted well, its cover
 * in a bezel that a bundle of threads runs into. The slides and controls live
 * in the SpotlightSlides island, which receives plain post objects.
 */
const SpotlightPosts = ({ fragment, globalPageProps, as = 'h2' }: Props) => {
  const headingId = useId();
  const { locale } = globalPageProps.params;
  const {
    featuredPostsHeader: title,
    featuredPostsSubheader: subtitle,
    featuredPosts,
  } = readFragment(FeaturedPostsSectionFragment, fragment);
  const posts = featuredPosts.map((post) =>
    toSpotlightPost(post, globalPageProps),
  );

  // slideOf keeps its {n} and {total} placeholders: the island fills them per slide
  const labels: SpotlightLabels = {
    carousel: uiString(locale, 'featuredPosts'),
    previous: uiString(locale, 'previousPost'),
    next: uiString(locale, 'nextPost'),
    readMore: uiString(locale, 'readMore'),
    slideOf: uiString(locale, 'slideOf'),
    carouselRole: uiString(locale, 'carousel'),
    slideRole: uiString(locale, 'slide'),
  };

  return (
    <section
      className="section"
      aria-labelledby={title ? headingId : undefined}
      aria-label={title ? undefined : labels.carousel}
    >
      <div className="container-page">
        <SectionTitle
          id={headingId}
          title={title}
          paragraph={subtitle}
          align="left"
          as={as}
        />

        <div className="well reveal px-12 pt-12 pb-[88px] max-lg:p-8 max-md:p-5">
          <Threads
            shape={spotlightShape}
            className="opacity-[.62] max-lg:hidden"
          />
          <SpotlightSlides
            posts={posts}
            labels={labels}
            headingLevel={itemHeadingLevel(as)}
            labelledBy={title ? headingId : undefined}
          />
        </div>
      </div>
    </section>
  );
};

export default SpotlightPosts;
