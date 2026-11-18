import { stripStega } from '@datocms/content-link';
import { notFound } from 'next/navigation';
import DatoImage from '@/components/datocms/DatoImage';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { SharedElement } from '@/components/layout/PageTransition';
import PostMosaic from '@/components/posts/PostMosaic';
import PostsPageHeader from '@/components/posts/PostsPageHeader';
import { tagPillClass } from '@/components/posts/PostTags';
import Button from '@/components/ui/Button';
import type { ContentComponent } from '@/lib/datocms/realtime/types';
import { uiLabel } from '@/lib/i18n/uiStrings';
import { areaLabels } from '@/utils/authorAreas';
import { authorsUrl, authorUrl } from '@/utils/routes';
import { hasStructuredText } from '@/utils/structuredText';
import type { PageProps, Query } from './meta';

const Content: ContentComponent<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.author) {
    notFound();
  }

  const { locale } = globalPageProps.params;
  const { author } = data;
  const posts = author._allReferencingPosts;
  const portrait = author.picture?.responsiveImage;
  const areasOfInterest = areaLabels(author.areasOfInterest);

  return (
    <>
      <PostsPageHeader
        title={author.name}
        lead={author.role}
        media={
          portrait ? (
            // 96px: larger than Avatar's sizes, so the round crop is drawn here.
            // The portrait on the team section that opened this page travels here
            <SharedElement
              kind="portrait"
              href={authorUrl(globalPageProps, globalPageProps.params.slug)}
            >
              <div className="relative size-24 overflow-hidden rounded-full bg-subtle ring-1 ring-line">
                <DatoImage
                  fragment={portrait}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  sizes="96px"
                  priority
                />
              </div>
            </SharedElement>
          ) : undefined
        }
      >
        {hasStructuredText(author.description) && (
          <div className="mt-4 max-w-[40rem] text-body text-fg-muted [&_p+p]:mt-3">
            <DatoStructuredText data={author.description} />
          </div>
        )}
        {areasOfInterest.length > 0 && (
          <ul className="mt-6 flex flex-wrap justify-center gap-1.5">
            {areasOfInterest.map((area) => (
              <li key={stripStega(area)} className={tagPillClass}>
                {area}
              </li>
            ))}
          </ul>
        )}
        <Button
          href={authorsUrl(globalPageProps)}
          variant="secondary"
          size="sm"
          className="mt-8"
        >
          {uiLabel(locale, 'allAuthors')}
        </Button>
      </PostsPageHeader>

      {posts.length > 0 && (
        <section
          aria-labelledby="author-posts-title"
          className="container-page pt-16 lg:pt-24"
        >
          <h2 id="author-posts-title" className="mb-10 text-h3 lg:mb-12">
            {/* The raw name goes in, so Content Link can still target it */}
            {uiLabel(locale, 'postsBy', { name: author.name })}
          </h2>
          {/* Every post is the author's own: the bylines show the date only */}
          <PostMosaic
            posts={posts}
            globalPageProps={globalPageProps}
            headingLevel="h3"
            hideAuthor
          />
        </section>
      )}
    </>
  );
};

export default Content;
