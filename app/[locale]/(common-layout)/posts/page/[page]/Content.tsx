import { notFound } from 'next/navigation';
import Pagination from '@/components/posts/Pagination';
import PostGrid from '@/components/posts/PostGrid';
import PostsPageHeader from '@/components/posts/PostsPageHeader';
import { postsPageCount } from '@/components/posts/postsPagination';
import type { ContentComponent } from '@/lib/datocms/realtime/types';
import { uiString } from '@/lib/i18n/uiStrings';
import type { PageProps, Query } from './meta';

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

  return (
    <>
      {/* This route has no page record (and so no SEO tags): React hoists this title into <head> */}
      <title>{`${title} – ${pageText}`}</title>

      <PostsPageHeader
        label={uiString(locale, 'blog')}
        title={title}
        titleId="posts-title"
        meta={`${uiString(locale, 'postCount', { n: postCount })} · ${pageText}`}
      />

      <section
        aria-labelledby="posts-title"
        className="container-page mt-12 pb-24 max-md:mt-8 max-md:pb-16"
      >
        <PostGrid
          posts={data.allPosts}
          globalPageProps={globalPageProps}
          headingLevel="h2"
          prioritizeFirstRow
        />

        <Pagination
          page={page}
          postCount={postCount}
          globalPageProps={globalPageProps}
        />
      </section>
    </>
  );
};

export default Content;
