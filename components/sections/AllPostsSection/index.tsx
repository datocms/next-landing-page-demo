import Pagination from '@/components/posts/Pagination';
import { PostExcerptFragment } from '@/components/posts/PostExcerpt/fragment';
import PostFeature from '@/components/posts/PostFeature';
import PostGrid from '@/components/posts/PostGrid';
import PostMosaic from '@/components/posts/PostMosaic';
import TopicLinks, {
  type Topic,
  topicsOf,
} from '@/components/posts/TopicLinks';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiLabel, uiString } from '@/lib/i18n/uiStrings';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import type { SectionHeadingLevel } from '@/utils/headingLevel';

type Props = {
  posts: readonly (FragmentOf<typeof PostExcerptFragment> & { id: string })[];
  postCount: number;
  /** Every tag that has posts; without it the topics are those of the posts shown */
  topics?: readonly Topic[];
  pageTitle: string;
  globalPageProps: ResolvedGlobalPageProps;
  as?: SectionHeadingLevel;
};

/**
 * The "All posts" block: the first page of the posts and the links to the
 * other pages. When it opens the page (/posts) the newest post leads on the
 * tinted panel, the topics follow as a row of pills, then the other posts in
 * the grid with its wide tiles; the page title is the h1 for screen readers
 * and search engines only. Further down a page it is the plain grid.
 */
const AllPostsSection = ({
  posts,
  postCount,
  topics: allTopics,
  pageTitle,
  globalPageProps,
  as = 'h2',
}: Props) => {
  const { locale } = globalPageProps.params;
  const leadsPage = as === 'h1';

  if (posts.length === 0) return null;

  const pagination = (
    <Pagination
      page={1}
      postCount={postCount}
      globalPageProps={globalPageProps}
      className="mt-16"
    />
  );

  if (!leadsPage) {
    return (
      <section className="section" aria-label={uiString(locale, 'latestPosts')}>
        <div className="container-page">
          <PostGrid posts={posts} globalPageProps={globalPageProps} />
          {pagination}
        </div>
      </section>
    );
  }

  const [newest, ...others] = posts;
  // Every topic of the blog, or those of the posts on this page (their tags), by name
  const topics =
    allTopics ??
    topicsOf(posts.map((post) => readFragment(PostExcerptFragment, post)));

  return (
    <section aria-labelledby="posts-title">
      {/* The page's own CMS title (raw, so Content Link can target it) */}
      <h1 id="posts-title" className="sr-only">
        {pageTitle || uiLabel(locale, 'latestPosts')}
      </h1>

      <PostFeature fragment={newest} globalPageProps={globalPageProps} />

      <div className="container-page">
        <TopicLinks
          topics={topics}
          globalPageProps={globalPageProps}
          current="all"
          className="mt-10 lg:mt-14"
        />
        {others.length > 0 && (
          <PostMosaic
            posts={others}
            globalPageProps={globalPageProps}
            className="mt-10 lg:mt-14"
          />
        )}
        {pagination}
      </div>
    </section>
  );
};

export default AllPostsSection;
