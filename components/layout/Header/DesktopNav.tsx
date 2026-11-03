'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import type { Ref } from 'react';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import { toneClass } from '@/utils/tones';
import {
  ariaCurrent,
  containsCurrentPage,
  type NavGroup,
  type NavItem,
} from './navItems';
import { panelStateClass, useDropdown } from './useDropdown';

type Props = {
  items: NavItem[];
  pathname: string;
  locale: string;
  /** The nav and its list are measured by the header (useNavCollapse) */
  ref: Ref<HTMLElement>;
  listRef: Ref<HTMLUListElement>;
};

const navItemClass =
  'inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-ui text-ink-2 transition-colors hover:bg-well hover:text-ink aria-[current]:text-ink data-[current=true]:text-ink pointer-coarse:h-11 xl:px-3';

/** A dropdown group: a nav item that opens a panel of links, on hover too for mouse users */
const NavDropdown = ({
  group,
  pathname,
}: {
  group: NavGroup;
  pathname: string;
}) => {
  const { open, rootProps, triggerProps, panelProps } = useDropdown({
    openOnHover: true,
  });

  return (
    <li className="relative" {...rootProps}>
      <button
        {...triggerProps}
        data-current={containsCurrentPage(pathname, group.items)}
        className={cn(
          'group',
          navItemClass,
          'aria-expanded:bg-well aria-expanded:text-ink',
        )}
      >
        {group.title}
        <ChevronDown
          strokeWidth={1.75}
          aria-hidden="true"
          className="size-3.5 transition-transform duration-200 group-aria-expanded:rotate-180"
        />
      </button>

      {/* The ::before bridge keeps a hover-opened panel open while the pointer crosses the 8px gap */}
      <div
        {...panelProps}
        className={cn(
          'menu-panel absolute -left-1 top-[calc(100%+8px)] min-w-58 before:absolute before:inset-x-0 before:-top-2 before:h-2',
          panelStateClass(open),
        )}
      >
        <ul>
          {group.items.map((link, index) => (
            <li key={link.id}>
              <Link
                href={link.href}
                aria-current={ariaCurrent(pathname, link.href)}
                className="menu-item"
              >
                <span
                  aria-hidden="true"
                  className={cn(toneClass(index), 'dot size-2.5')}
                />
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

/**
 * The header's inline nav, from 72rem. min-w-0 lets it shrink below its
 * items, so the language pill always stays in place; while the header is
 * collapsed it stays laid out but invisible, so it can still be measured.
 */
const DesktopNav = ({ items, pathname, locale, ref, listRef }: Props) => (
  <nav
    ref={ref}
    aria-label={uiString(locale, 'mainNavigation')}
    className="hidden min-w-0 flex-1 min-[72rem]:block group-data-[collapsed=true]/header:invisible"
  >
    <ul ref={listRef} className="flex w-max items-center gap-0.5">
      {items.map((item) =>
        item.kind === 'group' ? (
          <NavDropdown key={item.id} group={item} pathname={pathname} />
        ) : (
          <li key={item.id}>
            <Link
              href={item.href}
              aria-current={ariaCurrent(pathname, item.href)}
              className={navItemClass}
            >
              {item.title}
            </Link>
          </li>
        ),
      )}
    </ul>
  </nav>
);

export default DesktopNav;
