'use client';

import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import Legal from './Legal';

export default function RealTimeLegal({
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

  return <Legal lng={locale} data={data} />;
}
