import type { SiteLocale } from '@/graphql/types/graphql';

export type GlobalPageProps = {
  params: {
    apiToken: string;
    locale: SiteLocale;
  };
};

export function buildUrl(globalPageProps: GlobalPageProps, path?: string) {
  return `/${globalPageProps.params.apiToken}/${globalPageProps.params.locale}${
    path || ''
  }`;
}
