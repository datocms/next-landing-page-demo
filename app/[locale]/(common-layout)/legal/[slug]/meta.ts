import {
  LegalDocument,
  type LegalQuery,
  type LegalQueryVariables,
} from '@/graphql/types/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = ResolvedGlobalPageProps & {
  params: {
    slug: string;
  };
};

export type Query = LegalQuery;
export type Variables = LegalQueryVariables;

export const query = LegalDocument;
