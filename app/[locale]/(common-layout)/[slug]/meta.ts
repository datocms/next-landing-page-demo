import {
  PageDocument,
  type PageQuery,
  type PageQueryVariables,
} from '@/graphql/types/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = ResolvedGlobalPageProps & {
  params: {
    slug: string;
  };
};

export type Query = PageQuery;
export type Variables = PageQueryVariables;

export const query = PageDocument;
