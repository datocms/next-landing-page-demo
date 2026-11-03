import { PostExcerptFragment } from '@/components/posts/PostExcerpt/fragment';
import PostMeta from '@/components/posts/PostExcerpt/PostMeta';
import PostCover from '@/components/sections/FeaturedPostsSection/PostCover';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import TileTitleLink from './TileTitleLink';

type Props = {
  fragment: FragmentOf<typeof PostExcerptFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** Position among the side tiles, which with `sideCount` sets the tile's placement */
  index: number;
  sideCount: number;
  headingLevel: 'h2' | 'h3';
};

/**
 * Side tile placement at lg. Tiles 1–2 stack beside the lead and the rest flow
 * three to a row; a trailing row of one or two tiles turns into wide,
 * horizontal tiles (one spans the row, two split it), so no cell is left empty.
 * `wideGrid` holds the horizontal layout's classes, empty for a regular tile.
 */
const lgPlacement = (index: number, sideCount: number) => {
  const trailing = sideCount > 2 ? (sideCount - 2) % 3 : 0;
  if (index < sideCount - trailing) {
    return { span: 'lg:col-span-2', wideGrid: '' };
  }
  return trailing === 1
    ? {
        span: 'lg:col-span-6',
        wideGrid:
          'lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-center lg:gap-x-5',
      }
    : {
        span: 'lg:col-span-3',
        wideGrid: 'lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-4',
      };
};

/** One of the posts after the lead: cover, meta and title; a compact row on phones */
const SideTile = ({
  fragment,
  globalPageProps,
  index,
  sideCount,
  headingLevel: Heading,
}: Props) => {
  const post = readFragment(PostExcerptFragment, fragment);
  const { span, wideGrid } = lgPlacement(index, sideCount);
  // A lone last tile on the 2-up tablet grid spans both columns as a row
  const tabletRow = sideCount % 2 === 1 && index === sideCount - 1;

  return (
    <article
      className={cn(
        'group relative flex flex-col rounded-card border border-line bg-well p-2 max-md:grid max-md:grid-cols-[88px_minmax(0,1fr)] max-md:items-center max-md:gap-x-3',
        span,
        wideGrid,
        tabletRow &&
          'md:max-lg:col-span-2 md:max-lg:grid md:max-lg:grid-cols-2 md:max-lg:items-center md:max-lg:gap-x-4',
      )}
    >
      <div className="photo aspect-[2/1] rounded-xl max-md:aspect-square md:max-lg:aspect-[16/10]">
        <PostCover
          cover={post.seoTags?.image?.responsiveImage}
          title={post.title}
          sizes="(min-width: 1024px) 372px, (min-width: 768px) 50vw, 88px"
        />
      </div>
      <div
        className={cn(
          'px-2.5 pt-3.5 pb-2 max-md:p-0 max-md:pe-1',
          wideGrid && 'lg:py-2 lg:ps-0 lg:pe-4',
        )}
      >
        <PostMeta tag={post.tags[0]?.tag} date={post._publishedAt} />
        <Heading className="mt-2 text-h3 leading-[1.35] text-ink max-md:text-base md:min-h-[2.7em]">
          <TileTitleLink
            title={post.title}
            slug={post.slug}
            globalPageProps={globalPageProps}
          />
        </Heading>
      </div>
    </article>
  );
};

export default SideTile;
