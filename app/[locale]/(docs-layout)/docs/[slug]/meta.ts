import {
  DocumentationPageDocument,
  type DocumentationPageQuery,
  type DocumentationPageQueryVariables,
} from '@/graphql/types/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = ResolvedGlobalPageProps & {
  params: {
    slug: string;
  };
};

export type Query = DocumentationPageQuery;
export type Variables = DocumentationPageQueryVariables;

export const query = DocumentationPageDocument;
