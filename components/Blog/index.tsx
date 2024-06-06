import type { Section } from '@/utils/types';
import SingleBlog from '@/components/Blog/SingleBlog';
import SectionTitle from '@/components/Common/SectionTitle';
import type { GlobalPageProps } from '@/utils/globalPageProps';

type Props = {
  section: Section<'FeaturedPostsSectionRecord'>;
  globalPageProps: GlobalPageProps;
};

const Blog = ({
  section: {
    featuredPosts: blogData,
    featuredPostsHeader: blogHeader,
    featuredPostsSubheader: blogSubheader,
  },
  globalPageProps,
}: Props) => {
  return (
    <section
      id="blog"
      className="bg-primary bg-opacity-5 py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle title={blogHeader} paragraph={blogSubheader} center />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {blogData.map((blog) => (
            <div key={blog.id} className="w-full">
              <SingleBlog blog={blog} globalPageProps={globalPageProps} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
