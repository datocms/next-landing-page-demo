import { fallbackLng } from '@/app/i18n/settings';
import Legal from '@/components/Legal/Legal';
import RealTimeLegal from '@/components/Legal/RealTimeLegal';
import { legalQuery } from '@/queries/legal';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';

const BlogDetailsPage = async ({ params: { slug, lng } }) => {
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    legalQuery,
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
          token={process.env.DATOCMS_READONLY_API_TOKEN}
          query={legalQuery}
          slug={slug}
        />
      )}
    </>
  );
};

export default BlogDetailsPage;
