import type { SiteLocale } from '@/graphql/types/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

// BuildVariablesFn works with resolved params (after awaiting)
export type BuildVariablesFn<
  PageProps extends ResolvedGlobalPageProps,
  TVariables = Record<string, unknown>,
> = (
  context: PageProps & {
    fallbackLocale: SiteLocale;
  },
) => TVariables;

export type RealtimeUpdatesPage<
  PageProps extends ResolvedGlobalPageProps,
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
  PageProps extends ResolvedGlobalPageProps,
  TResult = unknown,
> = (
  props: PageProps & {
    data: TResult;
  },
) => React.ReactNode;
