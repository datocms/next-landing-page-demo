import {
  LegalDocument,
  type LegalQuery,
  type LegalQueryVariables,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = GlobalPageProps & {
  params: {
    slug: string;
  };
};

export type Query = LegalQuery;
export type Variables = LegalQueryVariables;

export const query = LegalDocument;
