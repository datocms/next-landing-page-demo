import DatoImage from '@/components/DatoImage';
import { type FragmentType, getFragmentData } from '@/graphql/types';
import {
  FeaturedPostsSectionFragmentDoc,
  PostExcerptFragmentDoc,
} from '@/graphql/types/graphql';
import { type GlobalPageProps, buildUrl } from '@/utils/globalPageProps';
import transformDate from '@/utils/transformDate';
import Link from 'next/link';

type Props = {
  fragment: FragmentType<typeof FeaturedPostsSectionFragmentDoc>;
  globalPageProps: GlobalPageProps;
};

const MinimalistFeaturedPostsGrid = ({ fragment, globalPageProps }: Props) => {
  const {
    featuredPosts: blogData,
    featuredPostsHeader: blogHeader,
    featuredPostsSubheader: blogSubheader,
  } = getFragmentData(FeaturedPostsSectionFragmentDoc, fragment);
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold capitalize text-gray-800 dark:text-white lg:text-3xl">
          {blogHeader}
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-2">
          {blogData.map((postFragment) => {
            const post = getFragmentData(PostExcerptFragmentDoc, postFragment);

            return (
              <div key={post.id} className="flex gap-4">
                {post.seoTags?.image?.responsiveImage && (
                  <div className="relative h-56 w-56 flex-shrink-0 overflow-hidden rounded-lg object-cover">
                    <DatoImage
                      layout="fill"
                      objectFit="cover"
                      objectPosition="50% 20%"
                      fragment={post.seoTags?.image?.responsiveImage}
                    />
                  </div>
                )}

                <div className="flex flex-col justify-between py-6 lg:mx-6">
                  <Link
                    href={buildUrl(globalPageProps, `/posts/${post.slug}`)}
                    className="text-xl font-semibold text-gray-800 hover:underline dark:text-white "
                  >
                    {post.title}
                  </Link>

                  {post._publishedAt && (
                    <span className="text-sm text-gray-500 dark:text-gray-300">
                      {transformDate(post._publishedAt)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MinimalistFeaturedPostsGrid;
