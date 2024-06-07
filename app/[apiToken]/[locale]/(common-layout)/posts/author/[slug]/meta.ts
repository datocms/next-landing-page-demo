import {
  AuthorDocument,
  type AuthorQuery,
  type AuthorQueryVariables,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = GlobalPageProps & {
  params: {
    slug: string;
  };
};

export type Query = AuthorQuery;
export type Variables = AuthorQueryVariables;

export const query = AuthorDocument;
