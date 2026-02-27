import {
  CommonLayoutDocument,
  type CommonLayoutQuery,
  type CommonLayoutQueryVariables,
} from '@/graphql/types/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = ResolvedGlobalPageProps & {
  children: React.ReactNode;
};

export type Query = CommonLayoutQuery;
export type Variables = CommonLayoutQueryVariables;

export const query = CommonLayoutDocument;
