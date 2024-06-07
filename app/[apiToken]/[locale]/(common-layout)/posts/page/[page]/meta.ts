import {
  PostsDocument,
  type PostsQuery,
  type PostsQueryVariables,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = GlobalPageProps & {
  params: {
    page: number;
  };
};

export type Query = PostsQuery;
export type Variables = PostsQueryVariables;

export const query = PostsDocument;
