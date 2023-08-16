import PageIndicatorList from '@/components/Blog/PageIndicatorList';
import SingleBlog from '@/components/Blog/SingleBlog';
import { PostRecord, PostsQuery, SiteLocale } from '@/graphql/generated';

type Props = {
  data: PostsQuery;
  lng: SiteLocale;
  page: number;
};

const PostsPage = ({ data, lng, page }: Props) => {
  return (
    <section className="pb-[120px] pt-[120px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          {data.allPosts.map((post) => (
            <div
              key={post.id}
              className="mb-10 w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
            >
              <SingleBlog blog={post as PostRecord} locale={lng} />
            </div>
          ))}
        </div>

        <div className=" -mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <ul className="flex items-center justify-center pt-8">
              <li className="mx-1">
                <a
                  href={
                    page - 1 === 1
                      ? `/${lng}/posts`
                      : `/${lng}/posts/page/${page - 1}`
                  }
                  className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
                >
                  Prev
                </a>
              </li>
              <PageIndicatorList
                lng={lng}
                postCount={data['_allPostsMeta'].count}
              />
              {page * 9 <= data['_allPostsMeta'].count && (
                <li className="mx-1">
                  <a
                    href={`/${lng}/posts/page/${page + 1}`}
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
                  >
                    Next
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostsPage;
