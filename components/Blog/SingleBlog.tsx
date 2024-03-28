import {
  PostRecord,
  ResponsiveImage,
  SiteLocale,
} from "@/graphql/types/graphql";
import transformDate from "@/utils/transformDate";
import Link from "next/link";
import { Image as DatoImage } from "react-datocms";

type Props = {
  blog: PostRecord; //
  locale: SiteLocale;
};

const SingleBlog = ({ blog, locale }: Props) => {
  const { title, seoTags, author, tags, _publishedAt, slug } = blog;

  return (
    <>
      <div className="relative h-full overflow-hidden rounded-xl bg-white shadow-one dark:bg-dark">
        <Link
          href={"/" + locale + "/posts/" + slug}
          className="relative block h-[230px] w-full overflow-hidden"
        >
          <span className="absolute right-6 top-6 z-20 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold capitalize text-white">
            {tags[0].tag}
          </span>
          <div className="relative h-full w-full overflow-hidden">
            <DatoImage
              className="h-full w-full object-contain"
              layout="fill"
              objectFit="cover"
              objectPosition="50% 50%"
              data={seoTags!.image!.responsiveImage as ResponsiveImage}
            />
          </div>
        </Link>
        <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
          <h3>
            <Link
              href={"/" + locale + "/posts/" + slug}
              className="mb-4 block h-16 text-xl text-black hover:text-primary dark:text-white dark:hover:text-primary"
            >
              {title}
            </Link>
          </h3>
          <div className="mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10" />
          <div className="flex h-full items-center justify-between">
            <Link
              href={`/${locale}/posts/author/${author.slug}`}
              className="mr-5 flex items-center border-r border-body-color border-opacity-10 pr-5 dark:border-white dark:border-opacity-10 xl:mr-3 xl:pr-3 2xl:mr-5 2xl:pr-5"
            >
              <div className="mr-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full object-contain">
                  <DatoImage
                    className="h-full w-full object-cover"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="50% 50%"
                    data={author.picture.responsiveImage}
                  />
                </div>
              </div>
              <div className="w-full">
                <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">
                  {author.name}
                </h4>
                <div className="text-xs text-body-color">{author.bio}</div>
              </div>
            </Link>
            {_publishedAt && (
              <div className="inline-block">
                <div className="text-xs text-body-color">
                  {transformDate(_publishedAt)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleBlog;
