import {
  DocumentationHomePageDocument,
  type DocumentationHomePageQuery,
  type DocumentationHomePageQueryVariables,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = GlobalPageProps & {
  params: {
    slug: string;
  };
};

export type Query = DocumentationHomePageQuery;
export type Variables = DocumentationHomePageQueryVariables;

export const query = DocumentationHomePageDocument;
