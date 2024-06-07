import PageIndicatorList from '@/components/PageIndicatorList';
import PostExcerpt from '@/components/PostExcerpt';
import type { PageQuery } from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';

type Props = {
  data: PageQuery;
  globalPageProps: GlobalPageProps;
};

const PostGridRenderer = ({ data, globalPageProps }: Props) => {
  return (
    <section className="mt-4 pb-[120px] pt-[120px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          {data.allPosts.map((post) => (
            <div
              key={post.id}
              className="mb-10 w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
            >
              <PostExcerpt fragment={post} globalPageProps={globalPageProps} />
            </div>
          ))}
        </div>

        <div className=" -mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <ul className="flex items-center justify-center pt-8">
              <PageIndicatorList
                globalPageProps={globalPageProps}
                postCount={data._allPostsMeta.count}
                page={1}
              />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostGridRenderer;
