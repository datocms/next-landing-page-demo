import { fallbackLng } from '@/app/i18n/settings';
import AuthorPosts from '@/components/Blog/AuthorPosts';
import RealTimeAuthorPosts from '@/components/Blog/RealTimeAuthorPosts';
import { authorQuery } from '@/queries/author';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';

const AuthorPage = async ({ params }) => {
  const { lng } = params;
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    authorQuery,
    {
      locale: lng,
      fallbackLocale: fallbackLng,
      slug: params.slug,
    },
    isEnabled
  );

  return (
    <>
      {!isEnabled && <AuthorPosts data={data} lng={lng} />}
      {isEnabled && (
        <RealTimeAuthorPosts
          initialData={data}
          locale={lng}
          token={process.env.DATOCMS_READONLY_API_TOKEN}
          query={authorQuery}
          slug={params.slug}
        />
      )}
    </>
  );
};

export default AuthorPage;
