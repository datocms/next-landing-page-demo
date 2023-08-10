'use client';

import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import FooterRenderer from './FooterRenderer';

export default function RealTimeFooter({
  locale,
  initialData,
  token,
  query,
}: {
  locale: string;
  token: string;
  initialData: any;
  query: string;
}) {
  const { data, error, status } = useQuerySubscription({
    query,
    variables: {
      locale: locale,
    },
    token,
    initialData,
    preview: true,
  });

  return <FooterRenderer lng={locale} data={data} />;
}
