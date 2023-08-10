import SingleBlog from './SingleBlog';

const TagPosts = ({ data, lng }) => {
  return (
    <section className="py-[32px]">
      <h1 className="my-24 text-center text-2xl font-semibold text-gray-800 dark:text-white lg:text-4xl">
        {data.tag.tag}
      </h1>

      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          {data.tag['_allReferencingPosts'].map((post) => (
            <div
              key={post.id}
              className="mb-10 w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
            >
              <SingleBlog blog={post} locale={lng} />
            </div>
          ))}
        </div>

        <div
          className="wow fadeInUp -mx-4 flex flex-wrap"
          data-wow-delay=".15s"
        ></div>
      </div>
    </section>
  );
};

export default TagPosts;
