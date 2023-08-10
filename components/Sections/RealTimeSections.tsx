'use client';

import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import Section from './Sections';

export default function RealTimeSections({
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

  return <Section locale={locale} sections={data.page.sections} />;
}
