import { AuthorQuery, PostRecord, SiteLocale } from '@/graphql/types/graphql';
import SingleBlog from './SingleBlog';
import { Image as DatoImage } from 'react-datocms';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

type Props = {
  data: AuthorQuery;
  lng: SiteLocale;
};

const AuthorPosts = ({ data, lng }: Props) => {
  if (!data.author) notFound();
  return (
    <section className="mt-16 flex flex-col items-center justify-center py-[32px]">
      <section className="px-auto mx-auto mb-8 flex items-center justify-center bg-white px-16 dark:bg-gray-900">
        <div className="py-10">
          <div className="flex flex-col items-center justify-center gap-8 p-4 text-center md:flex-row md:text-start">
            <div className="relative aspect-square w-56 overflow-hidden rounded-xl drop-shadow-xl">
              <DatoImage
                className="h-full w-full object-cover"
                layout="fill"
                objectFit="cover"
                objectPosition="top"
                data={data.author.picture.responsiveImage}
              />
            </div>
            <div className="xl:mx-4 xl:w-1/2">
              <h1 className="text-2xl font-semibold capitalize text-gray-800 dark:text-white lg:text-3xl">
                {data.author.name}
              </h1>
              <p className="text-base text-body-color">{data.author.bio}</p>

              <div className="mt-4 max-w-2xl text-gray-500 dark:text-gray-300">
                <ReactMarkdown>{data.author.description}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          {data.author._allReferencingPosts.map((post) => (
            <div
              key={post.id}
              className="mb-10 w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
            >
              <SingleBlog blog={post as PostRecord} locale={lng} />
            </div>
          ))}
        </div>

        <div className=" -mx-4 flex flex-wrap"></div>
      </div>
    </section>
  );
};

export default AuthorPosts;
