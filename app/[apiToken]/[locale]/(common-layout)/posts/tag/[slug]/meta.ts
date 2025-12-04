import {
  TagDocument,
  type TagQuery,
  type TagQueryVariables,
} from '@/graphql/types/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = ResolvedGlobalPageProps & {
  params: {
    slug: string;
  };
};

export type Query = TagQuery;
export type Variables = TagQueryVariables;

export const query = TagDocument;
