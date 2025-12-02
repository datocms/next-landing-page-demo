import {
  PostsDocument,
  type PostsQuery,
  type PostsQueryVariables,
} from '@/graphql/types/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = ResolvedGlobalPageProps & {
  params: {
    page: number;
  };
};

export type Query = PostsQuery;
export type Variables = PostsQueryVariables;

export const query = PostsDocument;
