import PostCard from '@/components/posts/PostCard';
import PostGrid from '@/components/posts/PostGrid';
import type { VariantProps } from './types';

const FEATURED_SIZES =
  '(min-width: 1264px) 740px, (min-width: 1024px) calc((100vw - 120px) * 2 / 3), calc(100vw - 40px)';
const SMALL_SIZES =
  '(min-width: 1264px) 360px, (min-width: 1024px) calc((100vw - 120px) / 3), (min-width: 768px) calc((100vw - 76px) / 2), calc(100vw - 40px)';

/**
 * `featured`: the first post large on the left (8 columns: the post block with
 * a larger title and an excerpt) and the next two stacked on the right as the
 * usual post block (side by side on tablets). Posts after the third continue as the grid underneath, so nothing
 * an editor picks goes missing.
 */
const FeaturedPosts = ({
  posts,
  globalPageProps,
  headingLevel,
}: VariantProps) => {
  const [first, ...others] = posts;
  const side = others.slice(0, 2);
  const rest = others.slice(2);

  return (
    <>
      <div className="grid gap-x-7 gap-y-12 lg:grid-cols-12 lg:gap-x-10">
        <PostCard
          fragment={first}
          globalPageProps={globalPageProps}
          variant="featured"
          sizes={FEATURED_SIZES}
          headingLevel={headingLevel}
          className="reveal lg:col-span-8"
        />
        {side.length > 0 && (
          <div className="grid gap-x-7 gap-y-12 md:grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:content-start lg:gap-y-10">
            {side.map((post) => (
              <PostCard
                key={post.id}
                fragment={post}
                globalPageProps={globalPageProps}
                variant="small"
                sizes={SMALL_SIZES}
                headingLevel={headingLevel}
                className="reveal"
              />
            ))}
          </div>
        )}
      </div>
      {rest.length > 0 && (
        <PostGrid
          posts={rest}
          globalPageProps={globalPageProps}
          headingLevel={headingLevel}
          className="reveal mt-14"
        />
      )}
    </>
  );
};

export default FeaturedPosts;
