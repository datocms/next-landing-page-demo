import {
  PageDocument,
  type PageQuery,
  type PageQueryVariables,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = GlobalPageProps & {
  params: {
    slug: string;
  };
};

export type Query = PageQuery;
export type Variables = PageQueryVariables;

export const query = PageDocument;
