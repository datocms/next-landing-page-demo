import { getFallbackLocale } from '@/app/i18n/settings';
import DocumentaitonPageRenderer from '@/components/Documentaiton/DocumentationPageRenderer';
import RealTimeDocumentationPage from '@/components/Documentaiton/RealTimeDocumentationPage';
import { DocumentationPageDocument, SiteLocale } from '@/graphql/types/graphql';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

type Params = {
  params: {
    slug: string;
    lng: SiteLocale;
  };
};

const DocumentaitonPage = async ({ params: { slug, lng } }: Params) => {
  const fallbackLng = await getFallbackLocale();
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    DocumentationPageDocument,
    {
      slug,
      locale: lng,
      fallbackLocale: [fallbackLng],
    },
    isEnabled
  );

  if (!data || !data.documentationPage) notFound();

  return (
    <>
      {!isEnabled && <DocumentaitonPageRenderer data={data} />}
      {isEnabled && (
        <RealTimeDocumentationPage
          initialData={data}
          locale={lng}
          token={process.env.DATOCMS_READONLY_API_TOKEN || ''}
          query={DocumentationPageDocument}
          variables={{ slug, locale: lng, fallbackLocale: [fallbackLng] }}
        />
      )}
    </>
  );
};

export default DocumentaitonPage;
