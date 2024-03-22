import { getFallbackLocale } from '@/app/i18n/settings';
import Legal from '@/components/Footer/Legal/Legal';
import RealTimeLegal from '@/components/Footer/Legal/RealTimeLegal';
import { LegalDocument, SiteLocale } from '@/graphql/types/graphql';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';

type Params = {
  params: {
    slug: string;
    lng: SiteLocale;
  };
};

const BlogDetailsPage = async ({ params: { slug, lng } }: Params) => {
  const fallbackLng = await getFallbackLocale();
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    LegalDocument,
    {
      slug,
      locale: lng,
      fallbackLocale: [fallbackLng],
    },
    isEnabled
  );

  return (
    <>
      {!isEnabled && <Legal data={data} lng={lng} />}
      {isEnabled && (
        <RealTimeLegal
          initialData={data}
          locale={lng}
          token={process.env.DATOCMS_READONLY_API_TOKEN || ''}
          query={LegalDocument}
          variables={{ slug, locale: lng, fallbackLocale: [fallbackLng] }}
        />
      )}
    </>
  );
};

export default BlogDetailsPage;
