import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import type { ContentPage, RealtimeComponent } from './types';

/**
 * Builds the client component a route renders in Draft Mode (its RealTime.tsx).
 *
 * It subscribes to DatoCMS's Real-time Updates API with the same query the
 * page ran on the server, starts from that server result, and re-renders
 * `contentComponent` every time an editor changes the draft content.
 */
export function generateRealtimeComponent<
  PageProps extends ResolvedGlobalPageProps,
  Result = unknown,
  Variables = Record<string, unknown>,
>({
  contentComponent: Content,
}: {
  contentComponent: ContentPage<PageProps, Result>;
}) {
  const RealTime: RealtimeComponent<PageProps, Result, Variables> = ({
    pageProps,
    query,
    variables,
    initialData,
    token,
    baseEditingUrl,
  }) => {
    const { data } = useQuerySubscription({
      query,
      variables,
      token,
      initialData,
      includeDrafts: true,
      excludeInvalid: true,
      contentLink: 'v1',
      baseEditingUrl,
    });

    if (!data) return null;

    return <Content {...pageProps} data={data} />;
  };

  return RealTime;
}
