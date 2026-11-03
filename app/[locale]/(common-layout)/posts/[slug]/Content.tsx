import { stripStega } from '@datocms/content-link';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DatoImage from '@/components/datocms/DatoImage';
import SharePost from '@/components/posts/SharePost';
import TagLink from '@/components/posts/TagLink';
import type { ContentPage } from '@/lib/datocms/realtime/types';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import formatPostDate from '@/utils/formatPostDate';
import { buildUrl } from '@/utils/globalPageProps';
import { TONES, toneIndex } from '@/utils/tones';
import type { PageProps, Query } from './meta';
import PostBody from './PostBody';

/**
 * The site's public origin, resolved like the API routes do (Vercel and
 * Netlify set these variables). Server-only: in the draft-mode client tree
 * it is undefined and SharePost falls back to the browser address.
 */
const siteOrigin = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.URL;

const Content: ContentPage<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.post) {
    notFound();
  }

  const { locale } = globalPageProps.params;
  const { post } = data;
  const hasTags = post.tags.length > 0;
  const firstTag = post.tags[0];
  const date = post._publishedAt ? formatPostDate(post._publishedAt) : null;
  const avatar = post.author.picture?.responsiveImage;
  const authorUrl = buildUrl(
    globalPageProps,
    `/posts/author/${stripStega(post.author.slug)}`,
  );
  // The query doesn't select the slug: the route param is the same value
  const postPath = buildUrl(
    globalPageProps,
    `/posts/${globalPageProps.params.slug}`,
  );
  const shareUrl = siteOrigin ? new URL(postPath, siteOrigin).href : undefined;

  return (
    <article className="container-reading pt-14 pb-24 max-md:pt-8 max-md:pb-16">
      <header>
        {(firstTag || date) && (
          <div className="flex flex-wrap items-center gap-3">
            {firstTag && (
              <TagLink
                tag={firstTag.tag}
                globalPageProps={globalPageProps}
                slug={firstTag.slug}
              />
            )}
            {date && (
              <time dateTime={date.iso} className="mono">
                {date.label}
              </time>
            )}
          </div>
        )}

        <h1 className="mt-5 -ms-[0.02em] text-balance text-title text-ink">
          {post.title}
        </h1>

        <Link
          href={authorUrl}
          className="group hit-44 mt-7 flex w-fit max-w-full items-center gap-3"
        >
          {avatar && (
            <div
              className={cn(
                'ring-tone size-10 shrink-0 rounded-full',
                TONES[toneIndex(post.author.name)],
              )}
            >
              <div className="photo block size-full rounded-full">
                <DatoImage
                  fragment={avatar}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="50% 30%"
                  sizes="40px"
                />
              </div>
            </div>
          )}
          <span className="min-w-0">
            <span className="block text-[15px] leading-snug font-medium text-ink underline decoration-transparent decoration-1 underline-offset-4 transition-[text-decoration-color] duration-200 group-hover:decoration-current">
              {post.author.name}
            </span>
            {post.author.bio && (
              <span className="block text-meta text-ink-3">
                {post.author.bio}
              </span>
            )}
          </span>
        </Link>

        <div aria-hidden="true" className="hairline mt-8 rounded-full" />
      </header>

      <div className="post-article prose prose-lg mt-10">
        <PostBody content={post.content} globalPageProps={globalPageProps} />
      </div>

      <footer className="card mt-16 p-6 max-md:p-5">
        <dl className="grid gap-y-5">
          {hasTags && (
            <div className="grid gap-y-3 sm:grid-cols-[88px_minmax(0,1fr)] sm:items-center">
              <dt className="mono">{uiString(locale, 'tags')}</dt>
              {/* On touch screens wrapped rows sit 16px apart, so each chip's 48px hit area keeps 44px clear of its neighbours */}
              <dd className="flex flex-wrap gap-x-2 gap-y-4 pointer-fine:gap-y-2">
                {post.tags.map((tag) => (
                  <TagLink
                    key={tag.id}
                    tag={tag.tag}
                    globalPageProps={globalPageProps}
                    slug={tag.slug}
                  />
                ))}
              </dd>
            </div>
          )}
          <div
            className={cn(
              'grid gap-y-3 sm:grid-cols-[88px_minmax(0,1fr)] sm:items-center',
              hasTags && 'border-t border-line pt-5',
            )}
          >
            <dt className="mono">{uiString(locale, 'share')}</dt>
            <dd>
              <SharePost
                url={shareUrl}
                labels={{
                  share: uiString(locale, 'share'),
                  copyLink: uiString(locale, 'copyLink'),
                  copied: uiString(locale, 'copied'),
                  shareOn: uiString(locale, 'shareOn'),
                }}
              />
            </dd>
          </div>
        </dl>
      </footer>
    </article>
  );
};

export default Content;
