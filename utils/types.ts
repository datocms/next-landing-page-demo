import type { PageQuery } from '@/graphql/types/graphql';

export type Section<Typename extends string> = Extract<
  NonNullable<PageQuery['page']>['sections'][number],
  { __typename?: Typename | undefined }
>;
