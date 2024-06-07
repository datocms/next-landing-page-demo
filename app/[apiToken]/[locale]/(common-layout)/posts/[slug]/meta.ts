import {
  PostDocument,
  type PostQuery,
  type PostQueryVariables,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = GlobalPageProps & {
  params: {
    slug: string;
  };
};

export type Query = PostQuery;
export type Variables = PostQueryVariables;

export const query = PostDocument;
