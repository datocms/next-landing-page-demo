import type { SiteLocale } from '@/lib/datocms/graphql';

/** The props Next.js passes to a page or layout, before the params are awaited */
export type GlobalPageProps = {
  params: Promise<{ locale: string; [key: string]: string | number }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
  children?: React.ReactNode;
};

/** Page props once the params are awaited and the locale is known to be one of the project's */
export type ResolvedGlobalPageProps = {
  params: { locale: SiteLocale };
};
