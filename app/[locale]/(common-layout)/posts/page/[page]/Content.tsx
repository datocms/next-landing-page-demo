import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PaginationLinks, {
  POSTS_PER_PAGE,
  postsPageUrl,
} from '@/components/posts/PaginationLinks';
import PostExcerpt, { postCardLayout } from '@/components/posts/PostExcerpt';
import PostsPageHeader from '@/components/posts/PostsPageHeader';
import type { ContentPage } from '@/lib/datocms/realtime/types';
import { uiString } from '@/lib/i18n/uiStrings';
import type { PageProps, Query } from './meta';

const Content: ContentPage<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  const { locale } = globalPageProps.params;
  // Route params arrive as strings at runtime
  const page = Number(globalPageProps.params.page);

  if (data.allPosts.length === 0) {
    notFound();
  }

  const postCount = data._allPostsMeta.count;
  const pageCount = Math.max(1, Math.ceil(postCount / POSTS_PER_PAGE));
  const posts = data.allPosts;
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

        <nav
          aria-label={uiString(locale, 'pagination')}
          className="mt-12 flex justify-center"
        >
          <ul className="flex flex-wrap items-center justify-center gap-2">
            {page > 1 && (
              <li>
                <Link
                  href={postsPageUrl(globalPageProps, page - 1)}
                  rel="prev"
                  className="btn btn-secondary btn-sm h-10 max-md:h-11 pointer-coarse:h-11"
                >
                  <ChevronLeft
                    strokeWidth={1.75}
                    aria-hidden="true"
                    className="btn-arrow-back rtl:rotate-180"
                  />
                  {uiString(locale, 'previous')}
                </Link>
              </li>
            )}
            <PaginationLinks
              globalPageProps={globalPageProps}
              postCount={postCount}
              page={page}
            />
          </ul>
        </nav>
      </section>
    </>
  );
};

export default Content;
