import type { ResultOf } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { pageUrl } from '@/utils/routes';
import type { HeaderFragment } from './fragment';

export type NavLink = {
  id: string;
  title: string;
  href: string;
};

/** A top-level menu entry: a single link, or a dropdown group of links */
export type NavItem =
  | ({ kind: 'link' } & NavLink)
  | { kind: 'group'; id: string; title: string; items: NavLink[] };

export type NavGroup = Extract<NavItem, { kind: 'group' }>;

/** Flattens the Layout menu (links and dropdowns) into locale-aware hrefs */
export function buildNavItems(
  menu: ResultOf<typeof HeaderFragment>['menu'] | undefined,
  globalPageProps: ResolvedGlobalPageProps,
): NavItem[] {
  return (menu ?? []).map((item) => {
    if (item.__typename === 'MenuDropdownRecord') {
      return {
        kind: 'group',
        id: item.id,
        title:
          item.title || uiString(globalPageProps.params.locale, 'otherItems'),
        items: item.items.map((child) => ({
          id: child.id,
          title: child.title,
          href: pageUrl(globalPageProps, child.page.slug),
        })),
      };
    }

    return {
      kind: 'link',
      id: item.id,
      title: item.title,
      href: pageUrl(globalPageProps, item.page.slug),
    };
  });
}

/** The link's aria-current: `page` on the page itself, `true` on a page that lives under it */
export function ariaCurrent(pathname: string, href: string) {
  if (pathname === href) return 'page' as const;
  if (pathname.startsWith(`${href}/`)) return 'true' as const;
  return undefined;
}

/** Whether the current page is one of the group's links, or lives under one */
export const containsCurrentPage = (pathname: string, links: NavLink[]) =>
  links.some((link) => ariaCurrent(pathname, link.href));
