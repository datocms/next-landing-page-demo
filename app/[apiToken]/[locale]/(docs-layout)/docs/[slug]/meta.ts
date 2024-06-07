import {
  DocumentationPageDocument,
  type DocumentationPageQuery,
  type DocumentationPageQueryVariables,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = GlobalPageProps & {
  params: {
    slug: string;
  };
};

export type Query = DocumentationPageQuery;
export type Variables = DocumentationPageQueryVariables;

export const query = DocumentationPageDocument;
