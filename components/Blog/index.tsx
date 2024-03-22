import { PostRecord, SiteLocale } from '@/graphql/types/graphql';
import SectionTitle from '../Common/SectionTitle';
import SingleBlog from './SingleBlog';
import { Maybe } from 'graphql/jsutils/Maybe';

type BlogProps = {
  blogData: PostRecord[];
  blogHeader: string;
  blogSubheader: Maybe<string>;
  locale: SiteLocale;
};

const Blog = ({ blogData, blogHeader, blogSubheader, locale }: BlogProps) => {
  return (
    <section id="blog" className="bg-primary py-16 bg-opacity-5 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle title={blogHeader} paragraph={blogSubheader} center />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {blogData.map((blog) => (
            <div key={blog.id} className="w-full">
              <SingleBlog blog={blog} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
