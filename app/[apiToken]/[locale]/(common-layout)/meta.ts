import {
  CommonLayoutDocument,
  type CommonLayoutQuery,
  type CommonLayoutQueryVariables,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = GlobalPageProps & {
  children: React.ReactNode;
};

export type Query = CommonLayoutQuery;
export type Variables = CommonLayoutQueryVariables;

export const query = CommonLayoutDocument;
