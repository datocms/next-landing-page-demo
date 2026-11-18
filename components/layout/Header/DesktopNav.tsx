'use client';

import Link from 'next/link';
import {
  type Ref,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import { CaretIcon, CheckIcon } from '@/components/ui/icons';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import {
  ariaCurrent,
  containsCurrentPage,
  type NavGroup,
  type NavItem,
} from './navItems';
import { menuItemClass, menuPanelClass, useDropdown } from './useDropdown';

type Props = {
  items: NavItem[];
  pathname: string;
  locale: string;
  /** The nav and its list are measured by the header (useNavCollapse) */
  ref: Ref<HTMLElement>;
  listRef: Ref<HTMLUListElement>;
};

// Quiet items inside the white pill; the current page (or the group that holds it) takes
// the text colour and sits on the sliding tinted pill (NavIndicator), and an open menu
// takes the text colour too
const navItemClass =
  'relative z-[1] inline-flex h-9 items-center gap-1 whitespace-nowrap rounded-full px-3.5 text-[0.875rem] font-medium text-fg/75 transition-colors duration-150 hover:text-fg aria-[current]:text-fg data-[current=true]:text-fg aria-expanded:text-fg';

/** The bar's current item: a page link, or the dropdown trigger that holds the page */
const CURRENT =
  ':scope > li > [aria-current], :scope > li > [data-current="true"]';

/**
 * The tinted pill under the current item. It is one element for the whole bar, so
 * going from one page to another it slides there and takes the new item's width
 * (on the site's calm curve), instead of one pill vanishing and another appearing.
 * It moves on the click itself, before the new page arrives, then follows the
 * current item: after navigations, Back and Forward, resizes and a change of
 * language. Under reduced motion it simply jumps (styles/base.css).
 */
const useNavIndicator = (pathname: string) => {
  const list = useRef<HTMLUListElement | null>(null);
  const pill = useRef<HTMLSpanElement | null>(null);

  const moveTo = useCallback((target: Element | null, animate: boolean) => {
    const bar = list.current;
    const mark = pill.current;
    if (!bar || !mark) return;
    if (!(target instanceof HTMLElement)) {
      mark.style.opacity = '0';
      return;
    }
    mark.dataset.animate = String(animate && mark.style.opacity === '1');
    // Measured against the bar: a dropdown's trigger sits in a positioned item of its own
    const left =
      target.getBoundingClientRect().left -
      bar.getBoundingClientRect().left -
      bar.clientLeft;
    mark.style.width = `${target.offsetWidth}px`;
    mark.style.transform = `translateX(${left}px)`;
    mark.style.opacity = '1';
  }, []);

  const toCurrent = useCallback(
    (animate: boolean) => {
      moveTo(list.current?.querySelector(CURRENT) ?? null, animate);
    },
    [moveTo],
  );

  // The page changed (a click already moved it there; Back, Forward or a link
  // elsewhere on the page did not)
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure on every navigation
  useLayoutEffect(() => {
    toCurrent(true);
  }, [pathname, toCurrent]);

  useEffect(() => {
    const bar = list.current;
    if (!bar) return;
    // Widths change with the font loading, the language and the window
    const observer = new ResizeObserver(() => toCurrent(false));
    observer.observe(bar);
    // On the click, before the navigation: the pill leaves for the new item at once
    const onClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest('a[href]')
          : null;
      if (link?.parentElement?.parentElement === bar) moveTo(link, true);
    };
    bar.addEventListener('click', onClick);
    return () => {
      observer.disconnect();
      bar.removeEventListener('click', onClick);
    };
  }, [moveTo, toCurrent]);

  return { list, pill };
};

/** A dropdown group: a nav item that opens a panel of links, on hover too for mouse users */
const NavDropdown = ({
  group,
  pathname,
  current,
}: {
  group: NavGroup;
  pathname: string;
  /** Mark the trigger: the current page is one of its links and has no item of its own in the bar */
  current: boolean;
}) => {
  const { open, rootProps, triggerProps, panelProps } = useDropdown({
    openOnHover: true,
  });

  return (
    <li className="relative" {...rootProps}>
      <button
        {...triggerProps}
        data-current={current}
        className={cn('group', navItemClass)}
      >
        {group.title}
        <CaretIcon className="size-3.5 transition-transform duration-150 group-aria-expanded:rotate-180" />
      </button>

      {/* The ::before bridge keeps a hover-opened panel open while the pointer crosses the gap */}
      <div
        {...panelProps}
        className={cn(
          menuPanelClass(open),
          '-left-2.5 before:absolute before:inset-x-0 before:-top-2 before:h-2',
        )}
      >
        <ul>
          {group.items.map((link) => {
            const current = ariaCurrent(pathname, link.href);
            return (
              <li key={link.id}>
                <Link
                  href={link.href}
                  aria-current={current}
                  className={cn(menuItemClass, 'justify-between gap-6')}
                >
                  {link.title}
                  {current && (
                    <CheckIcon className="size-4 shrink-0 text-accent-ink" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
};

/**
 * The header's inline nav, from 1024px: a white pill centred between the logo and
 * the language menu. min-w-0 lets it shrink below its
 * items, so the language selector always stays in place; while the header is
 * collapsed it stays laid out but invisible, so it can still be measured.
 */
const DesktopNav = ({ items, pathname, locale, ref, listRef }: Props) => {
  // A page listed both in the bar and in a dropdown is marked once, in the bar
  const hasCurrentLink = items.some(
    (item) => item.kind === 'link' && ariaCurrent(pathname, item.href),
  );
  const { list, pill } = useNavIndicator(pathname);
  // The header measures the list too (useNavCollapse)
  const setList = useCallback(
    (node: HTMLUListElement | null) => {
      list.current = node;
      if (typeof listRef === 'function') listRef(node);
      else if (listRef) listRef.current = node;
    },
    [list, listRef],
  );

  return (
    <nav
      ref={ref}
      aria-label={uiString(locale, 'mainNavigation')}
      className="hidden min-w-0 flex-1 justify-center group-data-[collapsed=true]/header:invisible lg:flex"
    >
      <ul
        ref={setList}
        className="relative flex w-max items-center gap-x-0.5 rounded-full bg-surface p-[5px] shadow-[0_8px_24px_-14px_rgb(9_14_52/0.3)] ring-1 ring-fg/[0.04]"
      >
        <span
          ref={pill}
          aria-hidden="true"
          style={{ opacity: 0 }}
          className="pointer-events-none absolute top-[5px] left-0 h-9 rounded-full bg-tint data-[animate=true]:transition-[transform,width] data-[animate=true]:duration-[420ms] data-[animate=true]:ease-[cubic-bezier(0.2,0.7,0.2,1)]"
        />
        {items.map((item) =>
          item.kind === 'group' ? (
            <NavDropdown
              key={item.id}
              group={item}
              pathname={pathname}
              current={
                !hasCurrentLink && containsCurrentPage(pathname, item.items)
              }
            />
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
};

export default DesktopNav;
