import type { CSSProperties } from 'react';
import DatoImage from '@/components/datocms/DatoImage';
import { PostExcerptFragment } from '@/components/posts/PostExcerpt/fragment';
import PostLink from '@/components/posts/PostLink';
import PostMeta from '@/components/posts/PostMeta';
import PostTitle from '@/components/posts/PostTitle';
import { postExcerptText } from '@/components/posts/postExcerptText';
import { readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { VariantProps } from './types';

type Tone = 'tint' | 'ink' | 'subtle';

/**
 * `mosaic` (the mosaic page's look): the posts as tiles on the mosaic hero's
 * 12px gap. The first is the large tile: its cover with the top-left corner
 * cut as a quarter circle, like the hero's large image, and under it the
 * title, the excerpt and the byline on the tinted fill. The next two stack
 * beside it as text tiles, one navy, one pale. Each tile is one link. Below
 * 1024px the tiles stack.
 */
const MosaicPosts = ({
  posts,
  globalPageProps,
  headingLevel: Heading,
}: VariantProps) => {
  const { locale } = globalPageProps.params;
  const [first, ...rest] = posts;
  const lead = readFragment(PostExcerptFragment, first);
  const cover = lead.coverImage;
  const excerpt = postExcerptText(
    lead.title,
    lead.seoMeta?.description,
    lead.content,
  );
  const side = rest.slice(0, 2);
  const tones: Tone[] = ['ink', 'subtle'];

  return (
    <div
      className={cn(
        'grid gap-2.5 lg:gap-3',
        side.length > 0 && 'lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]',
      )}
    >
      <article className="reveal">
        <PostLink
          slug={lead.slug}
          globalPageProps={globalPageProps}
          className="flex h-full flex-col overflow-hidden rounded-card bg-tint"
        >
          {cover?.responsiveImage && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-tl-[min(14rem,45%)] rounded-br-card bg-subtle">
              <DatoImage
                fragment={cover.responsiveImage}
                alt=""
                layout="fill"
                objectFit="cover"
                objectPosition={
                  cover.focalPoint
                    ? `${cover.focalPoint.x * 100}% ${cover.focalPoint.y * 100}%`
                    : undefined
                }
                sizes="(min-width: 1184px) 660px, (min-width: 1024px) 58vw, 100vw"
              />
            </div>
          )}
          <div className="flex flex-1 flex-col p-6 sm:p-8">
            <Heading className="max-w-[28ch] text-[1.625rem] leading-[1.15] font-semibold tracking-[-0.04em] lg:text-[1.875rem]">
              <PostTitle
                title={lead.title}
                locale={locale}
                className="title-underline"
              />
            </Heading>
            {excerpt && (
              <p className="mt-3 line-clamp-2 max-w-[56ch] text-fg-muted text-small">
                {excerpt}
              </p>
            )}
            <PostMeta
              locale={locale}
              date={lead._publishedAt}
              author={lead.author}
              className="mt-auto pt-6"
            />
          </div>
        </PostLink>
      </article>

      {side.length > 0 && (
        <div className="grid gap-2.5 lg:gap-3">
          {side.map((post, index) => {
            const { title, slug, _publishedAt, author, seoMeta, content } =
              readFragment(PostExcerptFragment, post);
            const tone = tones[index];
            const text = postExcerptText(title, seoMeta?.description, content);
            return (
              <article
                key={post.id}
                style={
                  { '--reveal-delay': `${(index + 1) * 90}ms` } as CSSProperties
                }
                className="reveal"
              >
                <PostLink
                  slug={slug}
                  globalPageProps={globalPageProps}
                  className={cn(
                    'relative isolate flex h-full min-h-56 flex-col overflow-hidden rounded-card p-6 sm:p-8',
                    tone === 'ink' ? 'on-ink bg-ink text-surface' : 'bg-subtle',
                  )}
                >
                  {tone === 'ink' && (
                    // The mosaic hero's accent disc, half out of the corner
                    <span
                      aria-hidden="true"
                      className="absolute -top-10 -right-10 -z-10 size-28 rounded-full bg-accent"
                    />
                  )}
                  <Heading className="max-w-[24ch] pr-10 text-[1.25rem] leading-[1.22] font-semibold tracking-[-0.03em]">
                    <PostTitle
                      title={title}
                      locale={locale}
                      className="title-underline"
                    />
                  </Heading>
                  {text && (
                    <p
                      className={cn(
                        'mt-2 line-clamp-2 text-small',
                        tone === 'ink' ? 'text-surface/70' : 'text-fg-muted',
                      )}
                    >
                      {text}
                    </p>
                  )}
                  <PostMeta
                    locale={locale}
                    date={_publishedAt}
                    author={author}
                    className={cn(
                      'mt-auto pt-6',
                      tone === 'ink' &&
                        'text-surface/75! [&_*]:text-surface/75',
                    )}
                  />
                </PostLink>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MosaicPosts;
