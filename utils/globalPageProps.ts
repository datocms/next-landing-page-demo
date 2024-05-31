import type { SiteLocale } from '@/graphql/types/graphql';

export type GlobalPageProps = {
  params: {
    locale: SiteLocale;
  };
};

export function buildUrl(globalPageProps: GlobalPageProps, path?: string) {
  return `/${globalPageProps.params.locale}${path || ''}`;
}
