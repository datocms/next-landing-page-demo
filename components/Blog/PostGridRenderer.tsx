import {
  CollectionMetadata,
  PostRecord,
  SiteLocale,
} from '@/graphql/generated';
import PageIndicatorList from './PageIndicatorList';
import SingleBlog from './SingleBlog';

type Props = {
  data: PostRecord[];
  lng: SiteLocale;
  postMeta: CollectionMetadata;
};

const PostGridRenderer = ({ data, lng, postMeta }: Props) => {
  return (
    <section className="mt-4 pb-[120px] pt-[120px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          {data.map((post) => (
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
              <PageIndicatorList lng={lng} postCount={postMeta.count} />
              {9 < postMeta.count && (
                <li className="mx-1">
                  <a
                    href={`/${lng}/posts/page/2`}
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

export default PostGridRenderer;
