import { PostRecord, SiteLocale } from "@/graphql/types/graphql";
import transformDate from "@/utils/transformDate";
import { Maybe } from "graphql/jsutils/Maybe";
import Link from "next/link";
import { Image as DatoImage } from "react-datocms";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

type BlogProps = {
  blogData: PostRecord[];
  blogHeader: string;
  blogSubheader: Maybe<string>;
  locale: SiteLocale;
};

const ModernPostCards = ({
  blogData,
  blogHeader,
  blogSubheader,
  locale,
}: BlogProps) => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-semibold capitalize text-gray-800 dark:text-white lg:text-3xl">
            {blogHeader}
          </h1>

          <div className="mx-auto mt-4 max-w-lg text-gray-500">
            <ReactMarkdown>{blogSubheader || ""}</ReactMarkdown>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {blogData.map((post) => {
            return (
              <div key={post.id}>
                <div className="relative z-10 h-96 w-full overflow-hidden rounded-md object-cover">
                  {post.seoTags?.image?.responsiveImage && (
                    <DatoImage
                      layout="fill"
                      objectFit="cover"
                      objectPosition="50% 20%"
                      data={post.seoTags?.image?.responsiveImage}
                    />
                  )}
                </div>
                <div className="relative z-20 mx-auto -mt-20 max-w-lg rounded-md bg-white p-6 shadow dark:bg-gray-900">
                  <Link
                    href={"/" + locale + "/posts/" + post.slug}
                    className="font-semibold text-gray-800 hover:underline dark:text-white md:text-xl"
                  >
                    {post.title}
                  </Link>

                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-300 md:text-sm">
                    {post.seoTags?.description}
                  </p>

                  {post._publishedAt && (
                    <p className="mt-3 text-sm text-blue-500">
                      {transformDate(post._publishedAt)}
                    </p>
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

export default ModernPostCards;
