import type { SiteLocale } from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

export type BuildVariablesFn<
  PageProps extends GlobalPageProps,
  TVariables = Record<string, unknown>,
> = (
  context: PageProps & {
    fallbackLocale: SiteLocale;
  },
) => TVariables;

export type RealtimeUpdatesPage<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
> = (props: {
  initialData: TResult;
  pageProps: PageProps;
  variables: TVariables;
  query: TypedDocumentNode<TResult, TVariables>;
  token: string;
  children?: React.ReactNode;
}) => React.ReactNode;

export type ContentPage<
  PageProps extends GlobalPageProps,
  TResult = unknown,
> = (
  props: PageProps & {
    data: TResult;
  },
) => React.ReactNode;
