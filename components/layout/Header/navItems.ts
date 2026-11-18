import type { ResultOf } from '@/lib/datocms/graphql';
import { uiLabel } from '@/lib/i18n/uiStrings';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { docsHomeUrl, pageUrl } from '@/utils/routes';
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

type Menu = ResultOf<typeof HeaderFragment>['menu'];

/** What a menu item links to: a Page, or the Documentation Home */
type MenuLink = Extract<
  Menu[number],
  { __typename: 'MenuItemBlockRecord' }
>['link'];

function linkUrl(link: MenuLink, globalPageProps: ResolvedGlobalPageProps) {
  return link.__typename === 'DocumentationHomeRecord'
    ? docsHomeUrl(globalPageProps)
    : pageUrl(globalPageProps, link.slug);
}

/** Flattens the Layout menu (links and dropdowns) into locale-aware hrefs */
export function buildNavItems(
  menu: Menu | undefined,
  globalPageProps: ResolvedGlobalPageProps,
): NavItem[] {
  return (menu ?? []).map((item) => {
    if (item.__typename === 'MenuDropdownBlockRecord') {
      return {
        kind: 'group',
        id: item.id,
        title:
          item.title || uiLabel(globalPageProps.params.locale, 'otherItems'),
        items: item.items.map((child) => ({
          id: child.id,
          title: child.title,
          href: linkUrl(child.link, globalPageProps),
        })),
      };
    }

    return {
      kind: 'link',
      id: item.id,
      title: item.title,
      href: linkUrl(item.link, globalPageProps),
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
