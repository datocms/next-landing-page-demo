import Link from 'next/link';
import { notFound } from 'next/navigation';
import AuthorAvatar from '@/components/posts/AuthorAvatar';
import SharePost from '@/components/posts/SharePost';
import TagLink from '@/components/posts/TagLink';
import type { ContentComponent } from '@/lib/datocms/realtime/types';
import { uiString } from '@/lib/i18n/uiStrings';
import { websiteBaseUrl } from '@/lib/websiteBaseUrl';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatDate';
import { authorUrl, postUrl } from '@/utils/routes';
import type { PageProps, Query } from './meta';
import PostBody from './PostBody';

const Content: ContentComponent<PageProps, Query> = ({
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
  const date = post._publishedAt ? formatDate(post._publishedAt) : null;
  const avatar = post.author.picture?.responsiveImage;
  const authorHref = authorUrl(globalPageProps, post.author.slug);
  // The query doesn't select the slug: the route param is the same value
  const postPath = postUrl(globalPageProps, globalPageProps.params.slug);
  // websiteBaseUrl is undefined in the Draft Mode client tree: SharePost then uses the browser address
  const shareUrl = websiteBaseUrl
    ? new URL(postPath, websiteBaseUrl).href
    : undefined;

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
          href={authorHref}
          className="group hit-44 mt-7 flex w-fit max-w-full items-center gap-3"
        >
          {avatar && (
            <AuthorAvatar
              image={avatar}
              sizes="40px"
              ringName={post.author.name}
              className="size-10 shrink-0"
              photoClassName="block"
            />
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
