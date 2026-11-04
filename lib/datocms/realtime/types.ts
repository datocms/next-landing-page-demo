import type { ReactNode } from 'react';
import type { EnabledQueryListenerOptions } from 'react-datocms/use-query-subscription';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

/** A route's Content component: the page props plus the query result as `data` */
export type ContentComponent<
  PageProps extends ResolvedGlobalPageProps,
  Result = unknown,
> = (props: PageProps & { data: Result }) => ReactNode;

/** A route's RealTime component: the page props plus the subscription options, set on the server in Draft Mode */
export type RealtimeComponent<
  PageProps extends ResolvedGlobalPageProps,
  Result = unknown,
  Variables = Record<string, unknown>,
> = (
  props: EnabledQueryListenerOptions<Result, Variables> & {
    pageProps: PageProps;
  },
) => ReactNode;
