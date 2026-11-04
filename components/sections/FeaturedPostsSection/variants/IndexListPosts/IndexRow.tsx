import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import AuthorAvatar from '@/components/posts/AuthorAvatar';
import { isRedundantExcerpt } from '@/components/posts/isRedundantExcerpt';
import PostCover from '@/components/posts/PostCover';
import { PostExcerptFragment } from '@/components/posts/PostExcerpt/fragment';
import PostMeta from '@/components/posts/PostMeta';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import type { ItemHeadingLevel } from '@/utils/headingLevel';
import { postUrl } from '@/utils/routes';

type Props = {
  fragment: FragmentOf<typeof PostExcerptFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** Position in the list, and the list's length: they shape the focus ring */
  index: number;
  count: number;
  headingLevel: ItemHeadingLevel;
};

/**
 * The inset focus ring follows the list's rounded corners on the first and
 * last rows (the list clips its overflow), and stays square in between.
 */
const ringRadius = (index: number, count: number) => {
  if (count === 1) return '[--stretched-radius:18px]';
  if (index === 0) return '[--stretched-radius:18px_18px_0_0]';
  if (index === count - 1) return '[--stretched-radius:0_0_18px_18px]';
  return '[--stretched-radius:0]';
};

/**
 * One post as a row: thumb, title (with the description and byline from 768),
 * the tag chip and date, and an arrow. The title link covers the whole row.
 */
const IndexRow = ({
  fragment,
  globalPageProps,
  index,
  count,
  headingLevel: Heading,
}: Props) => {
  const post = readFragment(PostExcerptFragment, fragment);
  const avatar = post.author?.picture?.responsiveImage;
  const tag = post.tags[0]?.tag;
  const description = post.seoTags?.description;

  return (
    <article className="group relative grid min-h-24 grid-cols-[64px_minmax(0,1fr)_auto_32px] items-center gap-x-5 px-5 py-4 transition-colors duration-200 hover:bg-well max-md:grid-cols-[56px_minmax(0,1fr)] max-md:gap-x-3.5 max-md:px-4 max-md:py-3.5">
      <div className="photo size-16 rounded-xl max-md:size-14">
        <PostCover
          cover={post.seoTags?.image?.responsiveImage}
          title={post.title}
          sizes="64px"
          zoom={false}
        />
      </div>

      <div className="min-w-0">
        <PostMeta
          tag={tag}
          date={post._publishedAt}
          className="mb-1.5 md:hidden"
        />
        <Heading className="text-h3 leading-[1.35] text-ink max-md:text-base">
          <Link
            href={postUrl(globalPageProps, post.slug)}
            className={cn(
              'stretched-link flex underline decoration-transparent decoration-1 underline-offset-[3px] transition-[text-decoration-color] duration-200 [--stretched-offset:-3px] group-hover:decoration-current',
              ringRadius(index, count),
            )}
          >
            <span className="line-clamp-2 text-pretty max-md:line-clamp-3">
              {post.title}
            </span>
          </Link>
        </Heading>
        {description && !isRedundantExcerpt(post.title, description) && (
          <p className="mt-1 line-clamp-1 text-meta text-ink-3 max-lg:hidden">
            {description}
          </p>
        )}
        {post.author && (
          <div className="mt-1.5 flex items-center gap-2 text-meta text-ink-2 max-md:hidden">
            {avatar && (
              <AuthorAvatar
                image={avatar}
                sizes="20px"
                className="size-5 shrink-0"
              />
            )}
            <span className="truncate">{post.author.name}</span>
          </div>
        )}
      </div>

      <PostMeta
        tag={tag}
        date={post._publishedAt}
        stack
        className="max-md:hidden"
      />

      <span
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-full bg-well text-ink-2 transition-[background-color,color,translate] duration-200 group-focus-within:bg-accent-solid group-focus-within:text-white group-hover:bg-accent-solid group-hover:text-white max-md:hidden motion-safe:group-hover:translate-x-0.5 rtl:motion-safe:group-hover:-translate-x-0.5"
      >
        <ArrowRight className="size-4 rtl:rotate-180" strokeWidth={1.75} />
      </span>
    </article>
  );
};

export default IndexRow;
