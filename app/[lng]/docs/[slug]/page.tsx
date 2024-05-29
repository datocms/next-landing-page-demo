import { getFallbackLocale } from '@/app/i18n/settings';
import DocumentationPageRenderer from '@/components/Documentation/DocumentationPageRenderer';
import RealTimeDocumentationPage from '@/components/Documentation/RealTimeDocumentationPage';
import {
  DocumentationPageDocument,
  type SiteLocale,
} from '@/graphql/types/graphql';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

type Params = {
  params: {
    slug: string;
    lng: SiteLocale;
  };
};

const DocumentationPage = async ({ params: { slug, lng } }: Params) => {
  const fallbackLng = await getFallbackLocale();
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    DocumentationPageDocument,
    {
      slug,
      locale: lng,
      fallbackLocale: [fallbackLng],
    },
    isEnabled,
  );

  if (!data || !data.documentationPage) notFound();

  return (
    <>
      {!isEnabled && <DocumentationPageRenderer data={data} />}
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

export default DocumentationPage;
