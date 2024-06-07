import {
  ChangelogDocument,
  type ChangelogQuery,
  type ChangelogQueryVariables,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = GlobalPageProps & {
  params: {
    slug: string;
  };
};

export type Query = ChangelogQuery;
export type Variables = ChangelogQueryVariables;

export const query = ChangelogDocument;
