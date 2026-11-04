import { notFound } from 'next/navigation';
import PostGrid from '@/components/posts/PostGrid';
import PostsPageHeader from '@/components/posts/PostsPageHeader';
import type { ContentComponent } from '@/lib/datocms/realtime/types';
import { uiString } from '@/lib/i18n/uiStrings';
import { toneClassFor } from '@/utils/tones';
import type { PageProps, Query } from './meta';

const Content: ContentComponent<PageProps, Query> = ({
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
      <PostsPageHeader
        label={uiString(locale, 'tag')}
        title={data.tag.tag}
        titleId="tag-title"
        tone={toneClassFor(data.tag.tag)}
        meta={uiString(locale, 'postCount', { n: postCount })}
      />

      <section
        aria-labelledby="tag-title"
        className="container-page mt-12 pb-24 max-md:mt-8 max-md:pb-16"
      >
        {posts.length > 0 ? (
          <PostGrid
            posts={posts}
            globalPageProps={globalPageProps}
            headingLevel="h2"
            prioritizeFirstRow
          />
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
