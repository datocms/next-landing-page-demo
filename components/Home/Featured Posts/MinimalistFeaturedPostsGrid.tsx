import { PostRecord, SiteLocale } from "@/graphql/types/graphql";
import transformDate from "@/utils/transformDate";
import { Maybe } from "graphql/jsutils/Maybe";
import Link from "next/link";
import { Image as DatoImage } from "react-datocms";

type BlogProps = {
  blogData: PostRecord[];
  blogHeader: string;
  blogSubheader: Maybe<string>;
  locale: SiteLocale;
};

const MinimalistFeaturedPostsGrid = ({
  blogData,
  blogHeader,
  blogSubheader,
  locale,
}: BlogProps) => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold capitalize text-gray-800 dark:text-white lg:text-3xl">
          {blogHeader}
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-2">
          {blogData.map((post) => {
            return (
              <div key={post.id} className="flex gap-4">
                {post.seoTags?.image?.responsiveImage && (
                  <div className="relative h-56 w-56 flex-shrink-0 overflow-hidden rounded-lg object-cover">
                    <DatoImage
                      layout="fill"
                      objectFit="cover"
                      objectPosition="50% 20%"
                      data={post.seoTags?.image?.responsiveImage}
                    />
                  </div>
                )}

                <div className="flex flex-col justify-between py-6 lg:mx-6">
                  <Link
                    href={"/" + locale + "/posts/" + post.slug}
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
