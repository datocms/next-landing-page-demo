import {
  TagDocument,
  type TagQuery,
  type TagQueryVariables,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = GlobalPageProps & {
  params: {
    slug: string;
  };
};

export type Query = TagQuery;
export type Variables = TagQueryVariables;

export const query = TagDocument;
