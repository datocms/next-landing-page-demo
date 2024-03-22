import { PostRecord, SiteLocale, TagQuery } from '@/graphql/types/graphql';
import SingleBlog from './SingleBlog';
import { notFound } from 'next/navigation';

type Props = {
  data: TagQuery;
  lng: SiteLocale;
};

const TagPosts = ({ data, lng }: Props) => {
  if (!data.tag) {
    notFound();
  }
  return (
    <section className="py-[32px]">
      <div className='flex width-full justify-center items-center gap-4'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-16 w-16 stroke-primary opacity-90"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 6h.008v.008H6V6z"
          />
        </svg>
        <h1 className="my-24 text-center text-2xl font-semibold text-gray-800 dark:text-white lg:text-4xl">
          {data.tag.tag}
        </h1>
      </div>

      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          {data.tag['_allReferencingPosts'].map((post) => (
            <div
              key={post.id}
              className="mb-10 w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
            >
              <SingleBlog blog={post as PostRecord} locale={lng} />
            </div>
          ))}
        </div>

        <div className="-mx-4 flex flex-wrap"></div>
      </div>
    </section>
  );
};

export default TagPosts;
