'use client';

import { createContext, useContext } from 'react';

/** One page of the documentation tree, as the docs layout queries it (four levels deep) */
export type DocsTreePage = {
  id: string;
  slug: string;
  title: string;
  children?: (DocsTreePage | null)[] | null;
};

/** The subpages of a page, without the nulls GraphQL allows */
export const childPages = (page: DocsTreePage) =>
  (page.children ?? []).filter((child): child is DocsTreePage => !!child);

/** Every page in reading order: each page, then its subpages (depth first) */
export function flattenTree(pages: readonly DocsTreePage[]): DocsTreePage[] {
  return pages.flatMap((page) => [page, ...flattenTree(childPages(page))]);
}

/** The slug of the docs page a pathname shows (the last path segment) */
export const slugFromPathname = (pathname: string) =>
  pathname.split('/').at(-1) ?? '';

/**
 * The tree, handed down by DocsShell so that a page (its previous and next
 * links) can read it without querying it again
 */
export const DocsTreeContext = createContext<readonly DocsTreePage[]>([]);

export const useDocsTree = () => useContext(DocsTreeContext);
