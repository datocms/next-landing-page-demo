import type { Query as PageQuery } from '@/app/[locale]/(common-layout)/[slug]/meta';
import PaginationLinks, {
  POSTS_PER_PAGE,
} from '@/components/posts/PaginationLinks';
import PostExcerpt, { postCardLayout } from '@/components/posts/PostExcerpt';
import PostsPageHeader from '@/components/posts/PostsPageHeader';
import { uiString } from '@/lib/i18n/uiStrings';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

type Props = {
  data: PageQuery;
  globalPageProps: ResolvedGlobalPageProps;
};

/**
 * The "All posts" block: the first page of the post grid, with links to the
 * other pages. When it opens the page (the /posts page) it also brings the
 * blog header, matching /posts/page/[page].
 */
const AllPostsSection = ({ data, globalPageProps }: Props) => {
  const { locale } = globalPageProps.params;
  const postCount = data._allPostsMeta.count;
  const pageCount = Math.ceil(postCount / POSTS_PER_PAGE);
  const leadsPage =
    data.page?.sections[0]?.__typename === 'AllPostsSectionRecord';
  const posts = data.allPosts;

  if (posts.length === 0) {
    return null;
  }

  const grid = (
    <>
      <div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
        {posts.map((post, index) => (
          <PostExcerpt
            key={post.id}
            fragment={post}
            globalPageProps={globalPageProps}
            priority={leadsPage && index < 3}
            // Under the page h1 the card titles are the next level down
            headingLevel={leadsPage ? 'h2' : 'h3'}
            {...postCardLayout(index, posts.length)}
          />
        ))}
      </div>

      {pageCount > 1 && (
        <nav
          aria-label={uiString(locale, 'pagination')}
          className="mt-12 flex justify-center"
        >
          <ul className="flex flex-wrap items-center justify-center gap-2">
            <PaginationLinks
              globalPageProps={globalPageProps}
              postCount={postCount}
              page={1}
            />
          </ul>
        </nav>
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
        title={data.page?.label || uiString(locale, 'latestPosts')}
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
