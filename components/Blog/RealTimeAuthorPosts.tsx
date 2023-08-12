'use client';

import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import AuthorPosts from './AuthorPosts';

export default function RealTimeAuthorPosts({
  locale,
  initialData,
  token,
  query,
  slug,
}: {
  locale: string;
  token: string;
  initialData: any;
  query: string;
  slug: string;
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

  return <AuthorPosts lng={locale} data={data} />;
}
