import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import WithRealTimeUpdates from '.';
import type { ContentPage, RealtimeUpdatesPage } from './types';

export function generateRealtimeComponent<
  PageProps extends ResolvedGlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
>({
  contentComponent: Content,
}: {
  contentComponent: ContentPage<PageProps, TResult>;
}) {
  const component: RealtimeUpdatesPage<PageProps, TResult, TVariables> = (
    props,
  ) => {
    return (
      <WithRealTimeUpdates {...props}>
        {(contentProps) => <Content {...contentProps} />}
      </WithRealTimeUpdates>
    );
  };

  return component;
}
