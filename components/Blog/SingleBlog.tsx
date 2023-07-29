import Link from 'next/link';
import { Image as DatoImage } from 'react-datocms';

function transformDate(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
    date
  );
  const day = date.getDate();
  return `${month} ${day}, ${year}`;
}

const SingleBlog = ({ blog }) => {
  const { title, seoTags, description, author, tags, _publishedAt, slug } =
    blog;

  return (
    <>
      <div
        className="wow fadeInUp relative h-full overflow-hidden rounded-xl bg-white shadow-one dark:bg-dark"
        data-wow-delay=".9s"
      >
        <Link
          href={'/posts/' + slug}
          className="sM:h-[300px] relative block h-[230px] w-full overflow-hidden"
        >
          <span className="absolute top-6 right-6 z-20 inline-flex items-center justify-center rounded-full bg-primary py-2 px-4 text-sm font-semibold capitalize text-white">
            {tags[0].tag}
          </span>
          <DatoImage
            className="w-full object-contain"
            data={seoTags.image.responsiveImage}
          />
        </Link>
        <div className="p-6 sm:p-8 md:py-8 md:px-6 lg:p-8 xl:py-8 xl:px-5 2xl:p-8">
          <h3>
            <Link
              href={'/posts/' + slug}
              className="mb-4 block h-16 text-xl text-black hover:text-primary dark:text-white dark:hover:text-primary"
            >
              {title}
            </Link>
          </h3>
          <div className="mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10" />
          <div className="flex h-full items-center justify-between">
            <div className="mr-5 flex items-center border-r border-body-color border-opacity-10 pr-5 dark:border-white dark:border-opacity-10 xl:mr-3 xl:pr-3 2xl:mr-5 2xl:pr-5">
              <div className="mr-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full object-contain">
                  <DatoImage
                    className="h-full w-full object-cover"
                    data={author.picture.responsiveImage}
                  />
                </div>
              </div>
              <div className="w-full">
                <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">
                  {author.name}
                </h4>
                {/* <p className="text-xs text-body-color">"author.bio"</p> */}
              </div>
            </div>
            <div className="inline-block">
              {/* <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">
                Date
              </h4> */}
              <p className="text-xs text-body-color">
                {transformDate(_publishedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleBlog;
