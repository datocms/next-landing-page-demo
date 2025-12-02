import {
  PostDocument,
  type PostQuery,
  type PostQueryVariables,
} from '@/graphql/types/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = ResolvedGlobalPageProps & {
  params: {
    slug: string;
  };
};

export type Query = PostQuery;
export type Variables = PostQueryVariables;

export const query = PostDocument;
