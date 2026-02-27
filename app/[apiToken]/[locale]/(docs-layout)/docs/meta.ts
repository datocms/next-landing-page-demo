import {
  DocumentationHomePageDocument,
  type DocumentationHomePageQuery,
  type DocumentationHomePageQueryVariables,
} from '@/graphql/types/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = ResolvedGlobalPageProps & {
  params: {
    slug: string;
  };
};

export type Query = DocumentationHomePageQuery;
export type Variables = DocumentationHomePageQueryVariables;

export const query = DocumentationHomePageDocument;
