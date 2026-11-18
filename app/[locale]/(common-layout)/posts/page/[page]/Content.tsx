import { notFound } from 'next/navigation';
import Pagination from '@/components/posts/Pagination';
import PostMosaic from '@/components/posts/PostMosaic';
import { postsPageCount } from '@/components/posts/postsPagination';
import TopicLinks from '@/components/posts/TopicLinks';
import type { ContentComponent } from '@/lib/datocms/realtime/types';
import { uiString } from '@/lib/i18n/uiStrings';
import type { PageProps, Query } from './meta';

/**
 * A further page of the blog index: the topic pills, then the posts in the
 * grid with its wide tiles (no leading post here) and the pagination. The
 * title is the h1 for screen readers and search engines only, like on /posts.
 */
const Content: ContentComponent<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  const { locale } = globalPageProps.params;
  const page = Number(globalPageProps.params.page);

  if (data.allPosts.length === 0) {
    notFound();
  }

  const postCount = data._allPostsMeta.count;
  const pageCount = postsPageCount(postCount);
  const title = uiString(locale, 'latestPosts');
  const pageText = uiString(locale, 'pageOf', { page, total: pageCount });
  const topics = data.topics.filter(
    (topic) => topic._allReferencingPostsMeta.count > 0,
  );

  return (
    <>
      {/* This route has no page record (and so no SEO tags): React hoists this title into <head> */}
      <title>{`${title}, ${pageText}`}</title>

      <section
        aria-labelledby="posts-title"
        className="container-page pt-(--page-top)"
      >
        <h1 id="posts-title" className="sr-only">
          {`${title}, ${pageText}`}
        </h1>
        <TopicLinks
          topics={topics}
          globalPageProps={globalPageProps}
          current="all"
        />
        <PostMosaic
          posts={data.allPosts}
          globalPageProps={globalPageProps}
          prioritizeFirstRow
          className="mt-10 lg:mt-14"
        />
        <Pagination
          page={page}
          postCount={postCount}
          globalPageProps={globalPageProps}
          className="mt-16"
        />
      </section>
    </>
  );
};

export default Content;
