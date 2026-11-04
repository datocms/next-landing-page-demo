import Pagination from '@/components/posts/Pagination';
import type { PostExcerptFragment } from '@/components/posts/PostExcerpt/fragment';
import PostGrid from '@/components/posts/PostGrid';
import PostsPageHeader from '@/components/posts/PostsPageHeader';
import { postsPageCount } from '@/components/posts/postsPagination';
import type { FragmentOf } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import type { SectionHeadingLevel } from '@/utils/headingLevel';

type Props = {
  posts: (FragmentOf<typeof PostExcerptFragment> & { id: string })[];
  postCount: number;
  pageLabel: string;
  globalPageProps: ResolvedGlobalPageProps;
  as?: SectionHeadingLevel;
};

/**
 * The "All posts" block: the first page of the post grid, with links to the
 * other pages. When it opens the page (the /posts page) it also brings the
 * blog header, matching /posts/page/[page].
 */
const AllPostsSection = ({
  posts,
  postCount,
  pageLabel,
  globalPageProps,
  as = 'h2',
}: Props) => {
  const { locale } = globalPageProps.params;
  const pageCount = postsPageCount(postCount);
  const leadsPage = as === 'h1';

  if (posts.length === 0) {
    return null;
  }

  const grid = (
    <>
      <PostGrid
        posts={posts}
        globalPageProps={globalPageProps}
        // Under the page h1 the card titles are the next level down
        headingLevel={leadsPage ? 'h2' : 'h3'}
        prioritizeFirstRow={leadsPage}
      />

      {pageCount > 1 && (
        <Pagination
          page={1}
          postCount={postCount}
          globalPageProps={globalPageProps}
        />
      )}
    </>
  );

  if (!leadsPage) {
    return (
      <section className="section" aria-label={uiString(locale, 'latestPosts')}>
        <div className="container-page">{grid}</div>
      </section>
    );
  }

  const postTotal = uiString(locale, 'postCount', { n: postCount });

  return (
    <>
      <PostsPageHeader
        label={uiString(locale, 'blog')}
        // The page's own CMS label (raw, so Content Link can target it)
        title={pageLabel || uiString(locale, 'latestPosts')}
        titleId="posts-title"
        meta={
          pageCount > 1
            ? `${postTotal} · ${uiString(locale, 'pageOf', { page: 1, total: pageCount })}`
            : postTotal
        }
      />
      <section
        aria-labelledby="posts-title"
        className="container-page mt-12 pb-24 max-md:mt-8 max-md:pb-16"
      >
        {grid}
      </section>
    </>
  );
};

export default AllPostsSection;
