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
import { draftMode } from 'next/headers';
import Post from '@/components/Blog/Post';
import RealTimePost from '@/components/Blog/RealTimePost';

const BlogDetailsPage = async ({ params: { slug, lng } }) => {
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    postQuery,
    {
      slug,
      locale: lng,
      fallbackLocale: [fallbackLng],
    },
    isEnabled
  );

  if (!data.post) {
    notFound();
  }

  return (
    <>
      {!isEnabled && <Post data={data} lng={lng} />}
      {isEnabled && (
        <RealTimePost
          initialData={data}
          locale={lng}
          token={process.env.DATOCMS_READONLY_API_TOKEN}
          query={postQuery}
          slug={slug}
        />
      )}
    </>
  );
};

export default BlogDetailsPage;
