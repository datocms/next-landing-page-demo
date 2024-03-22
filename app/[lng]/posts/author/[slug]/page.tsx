import { getFallbackLocale } from '@/app/i18n/settings';
import AuthorPosts from '@/components/Blog/AuthorPosts';
import RealTimeAuthorPosts from '@/components/Blog/RealTime/RealTimeAuthorPosts';
import { AuthorDocument, SiteLocale } from '@/graphql/types/graphql';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

type Params = {
  params: {
    slug: string;
    lng: SiteLocale;
  };
};

const AuthorPage = async ({ params }: Params) => {
  const fallbackLng = await getFallbackLocale();
  const { lng } = params;
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    AuthorDocument,
    {
      locale: lng,
      fallbackLocale: fallbackLng,
      slug: params.slug,
    },
    isEnabled
  );

  if (!data.author) notFound();

  return (
    <>
      {!isEnabled && <AuthorPosts data={data} lng={lng} />}
      {isEnabled && (
        <RealTimeAuthorPosts
          initialData={data}
          locale={lng}
          token={process.env.DATOCMS_READONLY_API_TOKEN || ''}
          query={AuthorDocument}
          variables={{
            locale: lng,
            fallbackLocale: fallbackLng,
            slug: params.slug,
          }}
        />
      )}
    </>
  );
};

export default AuthorPage;
