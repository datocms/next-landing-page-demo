import { notFound } from 'next/navigation';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import AuthorAvatar from '@/components/posts/AuthorAvatar';
import PostGrid from '@/components/posts/PostGrid';
import PostsPageHeader from '@/components/posts/PostsPageHeader';
import type { ContentComponent } from '@/lib/datocms/realtime/types';
import { uiString } from '@/lib/i18n/uiStrings';
import { hasStructuredText } from '@/utils/structuredText';
import { toneClassFor } from '@/utils/tones';
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
  const postCount = author._allReferencingPostsMeta.count;
  const portrait = author.picture?.responsiveImage;

  return (
    <>
      <PostsPageHeader
        label={uiString(locale, 'author')}
        title={author.name}
        tone={toneClassFor(author.name)}
        media={
          portrait ? (
            // It sits on top of the header arches, which pass behind it
            <AuthorAvatar
              image={portrait}
              sizes="144px"
              ringName={author.name}
              className="size-36 max-lg:size-24"
              photoClassName="bg-white"
            />
          ) : undefined
        }
      >
        {author.bio && (
          <p className="mt-3 text-lead text-ink-2">{author.bio}</p>
        )}
        {hasStructuredText(author.description) && (
          <div className="prose prose-sm mt-4 max-w-[62ch]">
            <DatoStructuredText data={author.description} />
          </div>
        )}
      </PostsPageHeader>

      {posts.length > 0 && (
        <section
          aria-labelledby="author-posts-title"
          className="container-page mt-16 pb-24 max-md:mt-12 max-md:pb-16"
        >
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 max-md:mb-6">
            <h2 id="author-posts-title" className="text-h2 text-ink">
              {/* The raw name goes in, so Content Link can still target it */}
              {uiString(locale, 'postsBy', { name: author.name })}
            </h2>
            <p className="mono">
              {uiString(locale, 'postCount', { n: postCount })}
            </p>
          </div>
          <PostGrid
            posts={posts}
            globalPageProps={globalPageProps}
            prioritizeFirstRow
          />
        </section>
      )}
    </>
  );
};

export default Content;
