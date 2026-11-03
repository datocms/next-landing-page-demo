import { stripStega } from '@datocms/content-link';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useId } from 'react';
import DatoImage from '@/components/datocms/DatoImage';
import { PostExcerptFragment } from '@/components/posts/PostExcerpt/fragment';
import PostMeta from '@/components/posts/PostExcerpt/PostMeta';
import { FeaturedPostsSectionFragment } from '@/components/sections/FeaturedPostsSection/fragment';
import PostCover from '@/components/sections/FeaturedPostsSection/PostCover';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import {
  buildUrl,
  type ResolvedGlobalPageProps,
} from '@/utils/globalPageProps';

type Props = {
  fragment: FragmentOf<typeof FeaturedPostsSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** Pass "h1" when this block opens the page, so its title doubles as the page header */
  as?: 'h1' | 'h2';
};

type PhotoCardProps = {
  fragment: FragmentOf<typeof PostExcerptFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  headingLevel: 'h2' | 'h3';
};

/** One post: its cover, with the meta, title and byline on a white card pinned to the bottom */
const PhotoCard = ({
  fragment,
  globalPageProps,
  headingLevel: Heading,
}: PhotoCardProps) => {
  const post = readFragment(PostExcerptFragment, fragment);
  const avatar = post.author?.picture?.responsiveImage;

  return (
    // One grid cell: the white card overlays the photo without being positioned,
    // so the stretched link's overlay still covers the whole tile
    <article className="group relative grid rounded-card">
      <div className="photo aspect-[4/5] rounded-card [grid-area:1/1]">
        <PostCover
          cover={post.seoTags?.image?.responsiveImage}
          title={post.title}
          sizes="(min-width: 1024px) 390px, (min-width: 768px) 320px, 300px"
        />
      </div>

      <div className="float z-[2] m-2 self-end rounded-xl p-4 [grid-area:1/1] max-md:p-3.5 motion-safe:transition-[margin] motion-safe:duration-300 motion-safe:ease-out-expo motion-safe:group-hover:mb-2.5">
        <PostMeta tag={post.tags[0]?.tag} date={post._publishedAt} />
        <Heading className="mt-2.5 min-h-[2.7em] text-h3 leading-[1.35] text-ink">
          <Link
            href={buildUrl(globalPageProps, `/posts/${stripStega(post.slug)}`)}
            className="stretched-link flex [--stretched-offset:3px] [--stretched-radius:20px]"
          >
            <span className="line-clamp-3 text-pretty">{post.title}</span>
          </Link>
        </Heading>
        <div className="mt-3 flex items-center gap-2 text-meta text-ink-2">
          {avatar && (
            <div className="photo size-6 shrink-0 rounded-full">
              <DatoImage
                layout="fill"
                objectFit="cover"
                objectPosition="50% 30%"
                fragment={avatar}
                sizes="24px"
              />
            </div>
          )}
          {post.author && (
            <span className="min-w-0 truncate">{post.author.name}</span>
          )}
          <span
            aria-hidden="true"
            className="ms-auto grid size-8 shrink-0 place-items-center rounded-full bg-well text-ink transition-colors duration-200 group-focus-within:bg-accent-solid group-focus-within:text-white group-hover:bg-accent-solid group-hover:text-white"
          >
            <ArrowUpRight
              className="size-4 rtl:-scale-x-100"
              strokeWidth={1.75}
            />
          </span>
        </div>
      </div>
    </article>
  );
};

/**
 * Photo cards: tall natural-colour covers, each pinned by a white UI card that
 * carries the meta, title and byline, so no text ever sits on a photo. Three
 * columns from lg; below that a scroll-snap track that bleeds to the edges.
 */
const PhotoCards = ({ fragment, globalPageProps, as = 'h2' }: Props) => {
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
          h1Size="section"
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
                  // Post titles sit one level under the section head
                  headingLevel={as === 'h1' ? 'h2' : 'h3'}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PhotoCards;
