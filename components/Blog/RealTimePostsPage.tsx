'use client';

import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import PostsPage from './PostsPage';

export default function RealTimePostsPage({
  locale,
  initialData,
  token,
  query,
  page,
  skip,
}: {
  locale: string;
  token: string;
  initialData: any;
  query: string;
  page: number;
  skip: number;
}) {
  const { data, error, status } = useQuerySubscription({
    query,
    variables: {
      locale,
      skip,
    },
    token,
    initialData,
    preview: true,
  });

  return <PostsPage lng={locale} data={data} page={page} />;
}
