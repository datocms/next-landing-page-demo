import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import AuthorAvatar from '@/components/posts/AuthorAvatar';
import PostCover from '@/components/posts/PostCover';
import { PostExcerptFragment } from '@/components/posts/PostExcerpt/fragment';
import PostMeta from '@/components/posts/PostMeta';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import type { ItemHeadingLevel } from '@/utils/headingLevel';
import { postUrl } from '@/utils/routes';

type Props = {
  fragment: FragmentOf<typeof PostExcerptFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  headingLevel: ItemHeadingLevel;
};

/** One post: its cover, with the meta, title and byline on a white card pinned to the bottom */
const PhotoCard = ({
  fragment,
  globalPageProps,
  headingLevel: Heading,
}: Props) => {
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
            href={postUrl(globalPageProps, post.slug)}
            className="stretched-link flex [--stretched-offset:3px] [--stretched-radius:20px]"
          >
            <span className="line-clamp-3 text-pretty">{post.title}</span>
          </Link>
        </Heading>
        <div className="mt-3 flex items-center gap-2 text-meta text-ink-2">
          {avatar && (
            <AuthorAvatar
              image={avatar}
              sizes="24px"
              className="size-6 shrink-0"
            />
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

export default PhotoCard;
