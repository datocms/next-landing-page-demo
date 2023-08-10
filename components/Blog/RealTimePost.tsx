'use client';

import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import Post from './Post';

export default function RealTimePost({
  slug,
  locale,
  initialData,
  token,
  query,
}: {
  slug: string;
  locale: string;
  token: string;
  initialData: any;
  query: string;
}) {
  const { data, error, status } = useQuerySubscription({
    query,
    variables: {
      locale,
      slug,
    },
    token,
    initialData,
    preview: true,
  });

  return <Post lng={locale} data={data} />;
}
