import { stripStega } from '@datocms/content-link';
import { useId } from 'react';
import { redundantExcerpt } from '@/components/posts/PostExcerpt/excerpt';
import { PostExcerptFragment } from '@/components/posts/PostExcerpt/fragment';
import { FeaturedPostsSectionFragment } from '@/components/sections/FeaturedPostsSection/fragment';
import { Threads } from '@/components/ui/Ornaments';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import {
  buildUrl,
  type ResolvedGlobalPageProps,
} from '@/utils/globalPageProps';
import PostSpotlight from './PostSpotlight';
import spotlightShape from './spotlightShape';
import type { SpotlightLabels, SpotlightPost } from './types';

type Props = {
  fragment: FragmentOf<typeof FeaturedPostsSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** Pass "h1" when this block opens the page, so its title doubles as the page header */
  as?: 'h1' | 'h2';
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
    href: buildUrl(globalPageProps, `/posts/${stripStega(post.slug)}`),
    tag: post.tags[0]?.tag ?? null,
    date: post._publishedAt ?? null,
    // Hide a description that only repeats the title
    description: redundantExcerpt(post.title, post.seoTags?.description)
      ? null
      : (post.seoTags?.description ?? null),
    cover: post.seoTags?.image?.responsiveImage ?? null,
    author: post.author
      ? {
          name: post.author.name,
          bio: post.author.bio ?? null,
          href: buildUrl(
            globalPageProps,
            `/posts/author/${stripStega(post.author.slug)}`,
          ),
          picture: post.author.picture?.responsiveImage ?? null,
        }
      : null,
  };
};

/**
 * Spotlight well: one featured post at a time in a tinted well, its cover in a
 * white bezel that a bundle of accent threads runs into. The well and threads
 * render here (server-safe); the slides and controls live in the PostSpotlight
 * client island, which receives plain post objects.
 */
const SpotlightCarousel = ({ fragment, globalPageProps, as = 'h2' }: Props) => {
  const headingId = useId();
  const { locale } = globalPageProps.params;
  const {
    featuredPostsHeader: title,
    featuredPostsSubheader: subtitle,
    featuredPosts,
  } = readFragment(FeaturedPostsSectionFragment, fragment);

  if (featuredPosts.length === 0) {
    return null;
  }

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
          h1Size="section"
        />

        <div className="well reveal px-12 pt-12 pb-[88px] max-lg:p-8 max-md:p-5">
          <Threads
            shape={spotlightShape}
            className="opacity-[.62] max-lg:hidden"
          />
          <PostSpotlight
            posts={posts}
            labels={labels}
            headingLevel={as === 'h1' ? 'h2' : 'h3'}
            labelledBy={title ? headingId : undefined}
          />
        </div>
      </div>
    </section>
  );
};

export default SpotlightCarousel;
