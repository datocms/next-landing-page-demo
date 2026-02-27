import {
  DocumentationSidebarDocument,
  type DocumentationSidebarQuery,
  type DocumentationSidebarQueryVariables,
} from '@/graphql/types/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = ResolvedGlobalPageProps & {
  children: React.ReactNode;
};

export type Query = DocumentationSidebarQuery;
export type Variables = DocumentationSidebarQueryVariables;

export const query = DocumentationSidebarDocument;
