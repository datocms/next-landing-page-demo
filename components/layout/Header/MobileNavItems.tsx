'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { toneClass } from '@/utils/tones';
import {
  ariaCurrent,
  containsCurrentPage,
  type NavGroup,
  type NavItem,
} from './navItems';

type Props = {
  items: NavItem[];
  pathname: string;
  /** Called when a link is followed, so the menu closes */
  onNavigate: () => void;
};

const rowClass =
  'flex min-h-13 items-center justify-between gap-4 rounded-full px-[18px] font-medium text-base text-ink transition-colors hover:bg-well aria-[current]:bg-well';

/** A dropdown group as a disclosure, open from the start when it holds the current page */
const MobileNavGroup = ({
  group,
  pathname,
  onNavigate,
}: {
  group: NavGroup;
  pathname: string;
  onNavigate: () => void;
}) => (
  <details
    className="disclosure"
    open={containsCurrentPage(pathname, group.items) || undefined}
  >
    <summary className={cn(rowClass, 'cursor-pointer select-none')}>
      {group.title}
      <ChevronDown
        strokeWidth={1.75}
        aria-hidden="true"
        className="disclosure-chevron size-[18px] text-ink-3"
      />
    </summary>
    <ul className="pt-0.5 pb-1.5 pl-3">
      {group.items.map((link, index) => (
        <li key={link.id}>
          <Link
            href={link.href}
            aria-current={ariaCurrent(pathname, link.href)}
            onClick={onNavigate}
            className="flex min-h-11 items-center gap-3 rounded-full px-[18px] font-medium text-[15px] text-ink-2 transition-colors hover:bg-well hover:text-ink aria-[current]:bg-well aria-[current]:text-ink"
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
  </details>
);

/** The mobile menu's rows: one per link, and a disclosure per dropdown group */
const MobileNavItems = ({ items, pathname, onNavigate }: Props) => (
  <ul className="sheet-rows">
    {items.map((item) => (
      <li key={item.id}>
        {item.kind === 'link' ? (
          <Link
            href={item.href}
            aria-current={ariaCurrent(pathname, item.href)}
            onClick={onNavigate}
            className={rowClass}
          >
            {item.title}
          </Link>
        ) : (
          <MobileNavGroup
            group={item}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        )}
      </li>
    ))}
  </ul>
);

export default MobileNavItems;
