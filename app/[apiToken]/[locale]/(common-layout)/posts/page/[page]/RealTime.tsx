'use client';

import { generateRealtimeComponent } from '@/components/WithRealTimeUpdates/generateRealtime';
import Content from './Content';
import type { PageProps, Query, Variables } from './meta';

const RealTime = generateRealtimeComponent<PageProps, Query, Variables>({
  contentComponent: Content,
});

export default RealTime;
