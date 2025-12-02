import {
  ChangelogDocument,
  type ChangelogQuery,
  type ChangelogQueryVariables,
} from '@/graphql/types/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = ResolvedGlobalPageProps & {
  params: {
    slug: string;
  };
};

export type Query = ChangelogQuery;
export type Variables = ChangelogQueryVariables;

export const query = ChangelogDocument;
