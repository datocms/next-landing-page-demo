import { notFound } from 'next/navigation';
import PostMosaic from '@/components/posts/PostMosaic';
import PostsPageHeader from '@/components/posts/PostsPageHeader';
import TopicLinks from '@/components/posts/TopicLinks';
import type { ContentComponent } from '@/lib/datocms/realtime/types';
import { uiLabel } from '@/lib/i18n/uiStrings';
import type { PageProps, Query } from './meta';

/**
 * A tag's page: the tag's name as the h1, the topic pills under it (this tag
 * marked) to move between topics, then its posts in the blog's grid.
 */
const Content: ContentComponent<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.tag) {
    notFound();
  }

  const { locale, slug } = globalPageProps.params;
  const posts = data.tag._allReferencingPosts;
  const topics = data.topics.filter(
    (topic) => topic._allReferencingPostsMeta.count > 0,
  );

  return (
    <>
      <PostsPageHeader
        title={data.tag.name}
        titleId="tag-title"
        lead={posts.length === 0 ? uiLabel(locale, 'noTaggedPosts') : undefined}
      >
        <TopicLinks
          topics={topics}
          globalPageProps={globalPageProps}
          current={slug}
          centered
          className="mt-8 w-full"
        />
      </PostsPageHeader>

      <section
        aria-labelledby="tag-title"
        className="container-page mt-12 lg:mt-16"
      >
        {posts.length > 0 && (
          <PostMosaic
            posts={posts}
            globalPageProps={globalPageProps}
            prioritizeFirstRow
          />
        )}
      </section>
    </>
  );
};

export default Content;
