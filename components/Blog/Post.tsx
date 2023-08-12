import { fallbackLng } from '@/app/i18n/settings';
import SharePost from '@/components/Blog/SharePost';
import TagButton from '@/components/Blog/TagButton';
import QuoteBlock from '@/components/Blog/QuoteBlock';
import { postQuery } from '@/queries/post';
import queryDatoCMS from '@/utils/queryDatoCMS';
import transformDate from '@/utils/transformDate';
import {
  isBlockquote,
  isHeading,
  isParagraph,
} from 'datocms-structured-text-utils';
import { notFound } from 'next/navigation';
import {
  Image as DatoImage,
  StructuredText,
  renderNodeRule,
} from 'react-datocms';
import NewsletterCTABlock from '@/components/Blog/NewsletterCTABlock';
import CTABlock from '@/components/Blog/CTABlock';
import DateIcon from '@/components/Blog/svgs/DateIcon';
import SingleBlog from '@/components/Blog/SingleBlog';
import Link from 'next/link';

const Post = ({ data, lng }) => {
  return (
    <section className="pb-[120px] pt-[150px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 lg:w-8/12">
            <div>
              <h2 className="mb-8 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                {data.post.title}
              </h2>
              <div className="mb-10 flex flex-wrap items-center justify-between border-b border-body-color border-opacity-10 pb-4 dark:border-white dark:border-opacity-10">
                <div className="flex flex-wrap items-center">
                  <Link
                    href={`/${lng}/posts/author/${data.post.author.slug}`}
                    className="mb-5 mr-10 flex items-center"
                  >
                    <div className="mr-4">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <DatoImage
                          className="h-full w-full object-cover"
                          data={data.post.author.picture.responsiveImage}
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <h4 className="mb-1 text-base font-medium text-body-color">
                        <span>{data.post.author.name}</span>
                      </h4>
                      <p className="text-xs text-body-color">
                        {data.post.author.bio}
                      </p>
                    </div>
                  </Link>
                  <div className="mb-5 flex items-center">
                    <p className="mr-5 flex items-center text-base font-medium text-body-color">
                      {DateIcon}
                      {transformDate(data.post._publishedAt)}
                    </p>
                  </div>
                </div>
                <div className="mb-5">
                  <a
                    href={`/${lng}/posts/tag/${data.post.tags[0].slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                  >
                    {data.post.tags[0].tag}
                  </a>
                </div>
              </div>
              <div>
                <StructuredText
                  data={data.post.content}
                  renderBlock={({ record }: any) => {
                    //type this
                    switch (record.__typename) {
                      case 'ImageBlockRecord':
                        return (
                          <div className="mb-16 mt-16 overflow-hidden rounded-md shadow-md sm:h-[300px] md:h-[400px]">
                            <DatoImage data={record.image.responsiveImage} />
                          </div>
                        );
                      case 'NewsletterSubscriptionRecord':
                        return (
                          <NewsletterCTABlock
                            title={record.title}
                            subtitle={record.subtitle}
                            buttonHex={record.buttonColor.hex}
                            buttonLabel={record.buttonLabel}
                          />
                        );
                      case 'CtaButtonWithImageRecord':
                        return (
                          <CTABlock
                            title={record.title}
                            subtitle={record.subtitle}
                            buttonHex={record.buttonColor.hex}
                            buttonLabel={record.buttonLabel}
                            image={record.image.responsiveImage}
                          />
                        );
                      default:
                        return null;
                    }
                  }}
                  renderInlineRecord={({ record }) => {
                    switch (record.__typename) {
                      case 'PostRecord':
                        return (
                          <div
                            key={data.post.id}
                            className="mt-8 flex w-full items-center justify-center"
                          >
                            <div className="md:w-[55%]">
                              <SingleBlog blog={record} locale={lng} />
                            </div>
                          </div>
                        );
                      default:
                        return null;
                    }
                  }}
                  customNodeRules={[
                    renderNodeRule(isHeading, ({ children, key }) => {
                      return (
                        <h3
                          className="mb-4 mt-9 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl"
                          key={key}
                        >
                          {children}
                        </h3>
                      );
                    }),
                    renderNodeRule(isParagraph, ({ children, key }) => {
                      return (
                        <div
                          className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed"
                          key={key}
                        >
                          {children}
                        </div>
                      );
                    }),
                    renderNodeRule(isBlockquote, ({ children, key }) => {
                      return <QuoteBlock text={children} />;
                    }),
                  ]}
                />
                <div className="mt-16 items-center justify-between sm:flex">
                  <div className="mb-5">
                    <h5 className="mb-3 text-sm font-medium text-body-color">
                      Post Tags :
                    </h5>
                    <div className="flex items-center">
                      {data.post.tags.map((tag) => {
                        return (
                          <TagButton
                            key={tag.id}
                            tag={tag.tag}
                            lng={lng}
                            slug={tag.slug}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div className="mb-5">
                    <h5 className="mb-3 text-sm font-medium text-body-color sm:text-right">
                      Share this post :
                    </h5>
                    <div className="flex items-center sm:justify-end">
                      <SharePost />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Post;
