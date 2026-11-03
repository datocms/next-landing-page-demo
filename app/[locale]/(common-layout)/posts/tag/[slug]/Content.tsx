import { notFound } from 'next/navigation';
import PostExcerpt, { postCardLayout } from '@/components/posts/PostExcerpt';
import PostsPageHeader from '@/components/posts/PostsPageHeader';
import type { ContentPage } from '@/lib/datocms/realtime/types';
import { uiString } from '@/lib/i18n/uiStrings';
import { toneIndex } from '@/utils/tones';
import type { PageProps, Query } from './meta';

const Content: ContentPage<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.tag) {
    notFound();
  }

  const { locale } = globalPageProps.params;
  const posts = data.tag._allReferencingPosts;
  const postCount = data.tag._allReferencingPostsMeta.count;

  return (
    <>
      {/* No '#' prefix: tag chips across the site show the bare tag name; the label dot matches their tone */}
      <PostsPageHeader
        label={uiString(locale, 'tag')}
        title={data.tag.tag}
        titleId="tag-title"
        tone={toneIndex(data.tag.tag)}
        meta={uiString(locale, 'postCount', { n: postCount })}
      />

      <section
        aria-labelledby="tag-title"
        className="container-page mt-12 pb-24 max-md:mt-8 max-md:pb-16"
      >
        {posts.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {posts.map((post, index) => (
              <PostExcerpt
                key={post.id}
                fragment={post}
                globalPageProps={globalPageProps}
                priority={index < 3}
                headingLevel="h2"
                {...postCardLayout(index, posts.length)}
              />
            ))}
          </div>
        ) : (
          <p className="card p-8 text-center text-body text-ink-2">
            {uiString(locale, 'noTaggedPosts')}
          </p>
        )}
      </section>
    </>
  );
};

export default Content;
