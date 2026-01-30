import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useQuerySubscription } from 'react-datocms/use-query-subscription';

export default function WithRealTimeUpdates<
  PageProps extends ResolvedGlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
>({
  initialData,
  token,
  query,
  variables,
  children,
  pageProps,
  baseEditingUrl,
}: {
  initialData: TResult;
  variables: TVariables;
  query: TypedDocumentNode<TResult, TVariables>;
  children: (
    props: PageProps & {
      data: TResult;
    },
  ) => React.ReactNode;
  pageProps: PageProps;
  token: string;
  baseEditingUrl: string;
}) {
  const { data } = useQuerySubscription({
    query,
    variables,
    token,
    initialData,
    includeDrafts: true,
    contentLink: 'v1',
    baseEditingUrl,
  });

  if (!data) return null;

  return children({ ...pageProps, data });
}
