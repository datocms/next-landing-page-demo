'use client';

import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import PostGridRenderer from './PostGridRenderer';

export default function RealTimePostGridRenderer({
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

  return <PostGridRenderer lng={locale} data={data} />;
}
