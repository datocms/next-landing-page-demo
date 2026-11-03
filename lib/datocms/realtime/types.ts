import type { TadaDocumentNode } from 'gql.tada';
import type { ReactNode } from 'react';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

/** A route's Content component: the page props plus the query result as `data` */
export type ContentPage<
  PageProps extends ResolvedGlobalPageProps,
  Result = unknown,
> = (props: PageProps & { data: Result }) => ReactNode;

/** A route's RealTime component: what the server hands to the client in Draft Mode */
export type RealtimeComponent<
  PageProps extends ResolvedGlobalPageProps,
  Result = unknown,
  Variables = Record<string, unknown>,
> = (props: {
  initialData: Result;
  pageProps: PageProps;
  variables: Variables;
  query: TadaDocumentNode<Result, Variables>;
  token: string;
  baseEditingUrl: string;
}) => ReactNode;
