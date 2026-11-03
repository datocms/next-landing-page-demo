import { stripStega } from '@datocms/content-link';
import Link from 'next/link';
import DatoImage from '@/components/datocms/DatoImage';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import {
  buildUrl,
  type ResolvedGlobalPageProps,
} from '@/utils/globalPageProps';
import CoverFallback from './CoverFallback';
import { PostExcerptFragment } from './fragment';
import PostMeta from './PostMeta';

type Props = {
  fragment: FragmentOf<typeof PostExcerptFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** Below 768: a compact row with a 96px square thumb instead of a full card */
  phoneRow?: boolean;
  /** 768–1023: span both columns, image left and copy right (the odd last card of a 2-up grid) */
  tabletWide?: boolean;
  /** Overrides the cover's `sizes` attribute */
  sizes?: string;
  /** Load the cover eagerly (cards above the fold on index pages) */
  priority?: boolean;
  /** Title level: h3 under a section h2 (default), h2 when the grid sits right under the page h1 */
  headingLevel?: 'h2' | 'h3';
};

/** Cover widths of a card in the 1 → 2 → 3 column grid */
const CARD_COVER_SIZES =
  '(min-width: 1024px) 372px, (min-width: 768px) 50vw, 100vw';
/** Same, but a phone row shows a 96px square thumb below 768 */
const PHONE_ROW_COVER_SIZES =
  '(min-width: 1024px) 372px, (min-width: 768px) 50vw, 96px';

/**
 * Card layout for position `index` of `count` in a 1 → 2 → 3 column grid: the
 * first card stays a full card on phones, the rest become rows, and an odd
 * last card spans the 2-up tablet grid.
 */
export const postCardLayout = (index: number, count: number) => ({
  phoneRow: index > 0,
  tabletWide: index === count - 1 && count % 2 === 1,
});

/**
 * The post card shared by the featured posts grid, the all posts grid and the
 * blog index, author and tag pages: cover, tag chip and date, title and
 * byline. The title link stretches over the whole card; the author link sits
 * above it as its own tab stop.
 */
const PostExcerpt = ({
  fragment,
  globalPageProps,
  phoneRow = false,
  tabletWide = false,
  sizes,
  priority = false,
  headingLevel: Heading = 'h3',
}: Props) => {
  const { title, seoTags, author, tags, _publishedAt, slug } = readFragment(
    PostExcerptFragment,
    fragment,
  );

  const cover = seoTags?.image?.responsiveImage;
  const avatar = author?.picture?.responsiveImage;
  const coverSizes =
    sizes ?? (phoneRow ? PHONE_ROW_COVER_SIZES : CARD_COVER_SIZES);

  return (
    <article
      className={cn(
        'card card-hover group flex flex-col p-2',
        tabletWide &&
          'md:max-lg:col-span-2 md:max-lg:grid md:max-lg:grid-cols-2 md:max-lg:items-start md:max-lg:gap-x-4',
        phoneRow &&
          'max-md:grid max-md:grid-cols-[96px_minmax(0,1fr)] max-md:items-center max-md:gap-x-3.5',
      )}
    >
      <div
        className={cn(
          'photo aspect-[16/10] rounded-zone',
          phoneRow && 'max-md:aspect-square max-md:rounded-xl',
        )}
      >
        {cover ? (
          <div className="media-zoom absolute inset-0">
            <DatoImage
              layout="fill"
              objectFit="cover"
              objectPosition="50% 50%"
              fragment={cover}
              priority={priority}
              sizes={coverSizes}
            />
          </div>
        ) : (
          <CoverFallback seed={title} />
        )}
      </div>

      <div
        className={cn(
          'flex flex-1 flex-col px-3.5 pt-4 pb-[18px]',
          phoneRow && 'max-md:py-1 max-md:pr-1.5 max-md:pl-0',
        )}
      >
        <PostMeta tag={tags[0]?.tag} date={_publishedAt} />

        <Heading
          className={cn(
            'mt-2.5 text-h3 leading-[1.35] text-ink md:min-h-[2.7em]',
            phoneRow && 'max-md:mt-2 max-md:text-base',
          )}
        >
          {/* The link is a flex box so its ::after overlay stays out of the title's line box: Chrome only applies text-wrap: pretty to plain inline content */}
          <Link
            href={buildUrl(globalPageProps, `/posts/${stripStega(slug)}`)}
            className="stretched-link flex underline decoration-transparent decoration-1 underline-offset-[3px] transition-[text-decoration-color] duration-200 [--stretched-offset:3px] [--stretched-radius:19px] group-hover:decoration-current"
          >
            <span className="line-clamp-3 text-pretty">{title}</span>
          </Link>
        </Heading>

        {author && (
          <Link
            href={buildUrl(
              globalPageProps,
              `/posts/author/${stripStega(author.slug)}`,
            )}
            className={cn(
              'hit-44 z-10 mt-3 inline-flex w-fit items-center gap-2 rounded-full pr-1 text-meta text-ink-2 transition-colors duration-150 hover:text-ink',
              phoneRow && 'max-md:mt-2',
            )}
          >
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
            {author.name}
          </Link>
        )}
      </div>
    </article>
  );
};

export default PostExcerpt;
