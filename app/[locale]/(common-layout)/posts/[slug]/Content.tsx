import { notFound } from 'next/navigation';
import { BREAKOUT, BREAKOUT_SIZES } from '@/components/blocks/ImageBlock';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { SharedElement } from '@/components/layout/PageTransition';
import PostGrid from '@/components/posts/PostGrid';
import { Byline, PostDate } from '@/components/posts/PostMeta';
import SharePost from '@/components/posts/SharePost';
import TagLink from '@/components/posts/TagLink';
import AppLink from '@/components/ui/AppLink';
import Avatar from '@/components/ui/Avatar';
import Photo from '@/components/ui/Photo';
import SectionHeader from '@/components/ui/SectionHeader';
import TableOfContents, {
  MIN_TOC_HEADINGS,
} from '@/components/ui/TableOfContents';
import type { ContentComponent } from '@/lib/datocms/realtime/types';
import { uiString } from '@/lib/i18n/uiStrings';
import { websiteBaseUrl } from '@/lib/websiteBaseUrl';
import { cn } from '@/utils/cn';
import { headingOutline } from '@/utils/headingOutline';
import { authorUrl, postUrl } from '@/utils/routes';
import { hasStructuredText, rootNodes } from '@/utils/structuredText';
import { titleSize } from '@/utils/titleSize';
import type { PageProps, Query } from './meta';
import PostBody from './PostBody';

/**
 * The reading column: 68ch, centred. The cover and the body's images reach
 * 120px past it on each side (BREAKOUT).
 */
const COLUMN = 'mx-auto w-full max-w-measure';

/**
 * From 1440px, with enough headings, the "On this page" list sits to the right
 * of the text, clear of the wider images: the body's grid reaches out to the
 * page gutters and the text column keeps its place in the middle; the 152px
 * gap is the images' 120px and 32px of air. Narrower screens have no room
 * beside the images, so the list is left out there.
 */
const WITH_TOC =
  'min-[90rem]:-mx-[calc(var(--page-edge)-var(--gutter))] min-[90rem]:grid min-[90rem]:grid-cols-[minmax(0,1fr)_68ch_minmax(0,1fr)] min-[90rem]:gap-x-[152px]';

/** The author's name as a link: underlined on hover */
const NAME_LINK =
  'underline decoration-transparent decoration-1 underline-offset-[3px] transition-colors duration-150 hover:decoration-current';

const Content: ContentComponent<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.post) {
    notFound();
  }

  const { locale } = globalPageProps.params;
  const { post, morePosts } = data;
  const { author } = post;
  const authorHref = authorUrl(globalPageProps, author.slug);
  // The query doesn't select the slug: the route param is the same value
  const postPath = postUrl(globalPageProps, globalPageProps.params.slug);
  // websiteBaseUrl is undefined in the Draft Mode client tree: SharePost then uses the browser address
  const shareUrl = websiteBaseUrl
    ? new URL(postPath, websiteBaseUrl).href
    : undefined;
  const scale = titleSize(post.title, 'h1');

  // The h2s get anchor ids and, when there are enough, an "On this page" list
  const headings = headingOutline(rootNodes(post.content.value));
  const anchorIds = new Map(headings.map(({ node, id }) => [node, id]));
  const showToc = headings.length >= MIN_TOC_HEADINGS;

  return (
    <>
      <article className="container-page pt-(--page-top)">
        <header className={COLUMN}>
          {post.tags.length > 0 && (
            <ul
              aria-label={uiString(locale, 'tags')}
              className="flex flex-wrap gap-1.5"
            >
              {post.tags.map((tag) => (
                <li key={tag.id}>
                  <TagLink
                    tag={tag.name}
                    slug={tag.slug}
                    globalPageProps={globalPageProps}
                  />
                </li>
              ))}
            </ul>
          )}
          <h1
            data-long={scale.long}
            className={cn(scale.className, post.tags.length > 0 && 'mt-5')}
          >
            {post.title}
          </h1>
          {/* The byline of every post listing: the 26px photo, the name, the date */}
          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-ui text-fg-muted">
            <Byline author={author} href={authorHref} />
            {post._publishedAt && (
              <PostDate date={post._publishedAt} locale={locale} />
            )}
          </div>
        </header>

        {post.coverImage?.responsiveImage && (
          <div className={cn(COLUMN, 'mt-10 lg:mt-14')}>
            {/* The cover of the card that opened this post travels here */}
            <SharedElement kind="cover" href={postPath}>
              <Photo
                image={post.coverImage.responsiveImage}
                frame="cover"
                focalPoint={post.coverImage.focalPoint}
                sizes={BREAKOUT_SIZES}
                priority
                alt=""
                className={cn(BREAKOUT, 'w-auto!')}
              />
            </SharedElement>
          </div>
        )}

        <div className={cn('mt-10 lg:mt-14', showToc && WITH_TOC)}>
          <div className={cn(COLUMN, showToc && 'min-[90rem]:col-start-2')}>
            <div className="prose">
              <PostBody
                content={post.content}
                globalPageProps={globalPageProps}
                anchorIds={anchorIds}
                coverImageId={
                  post.coverImage?.responsiveImage ? post.coverImage.id : null
                }
              />
            </div>

            <div className="mt-14 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-6">
              <span className="text-small text-fg-muted">
                {uiString(locale, 'share')}
              </span>
              <SharePost
                url={shareUrl}
                labels={{
                  share: uiString(locale, 'shareOther'),
                  copyLink: uiString(locale, 'copyLink'),
                  copied: uiString(locale, 'copied'),
                  shareOn: uiString(locale, 'shareOn'),
                }}
              />
            </div>

            <aside
              aria-label={uiString(locale, 'writtenBy')}
              className="tile mt-8 flex gap-4 p-6 sm:gap-5 sm:p-8"
            >
              <Avatar
                image={author.picture?.responsiveImage}
                name={author.name}
                size={56}
              />
              <div className="min-w-0">
                <p className="text-body font-semibold">
                  <AppLink href={authorHref} className={NAME_LINK}>
                    {author.name}
                  </AppLink>
                </p>
                {author.role && (
                  <p className="text-small text-fg-muted">{author.role}</p>
                )}
                {hasStructuredText(author.description) && (
                  <div className="mt-3 text-small text-fg-muted [&_p+p]:mt-2">
                    <DatoStructuredText data={author.description} />
                  </div>
                )}
              </div>
            </aside>
          </div>

          {showToc && (
            <TableOfContents
              headings={headings}
              locale={locale}
              className="hidden min-[90rem]:col-start-3 min-[90rem]:block"
            />
          )}
        </div>
      </article>

      {morePosts.length > 0 && (
        <section aria-labelledby="more-posts-title" className="section">
          <div className="container-page">
            <SectionHeader
              id="more-posts-title"
              title={uiString(locale, 'morePosts')}
            />
            <PostGrid posts={morePosts} globalPageProps={globalPageProps} />
          </div>
        </section>
      )}
    </>
  );
};

export default Content;
