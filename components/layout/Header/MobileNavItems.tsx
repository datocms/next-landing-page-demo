'use client';

import Link from 'next/link';
import { CaretIcon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';
import {
  ariaCurrent,
  containsCurrentPage,
  type NavGroup,
  type NavItem,
} from './navItems';

type Props = {
  items: NavItem[];
  pathname: string;
  /** Called when a link is followed, so the sheet closes */
  onNavigate: () => void;
};

// Rows of a real list, so hairlines sit between them. The current page is in the accent
const rowClass =
  'flex min-h-13 items-center justify-between gap-4 text-body font-medium text-fg';
const currentClass = 'aria-[current]:text-accent-ink';

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
    className="group"
    open={containsCurrentPage(pathname, group.items) || undefined}
  >
    <summary className={cn(rowClass, 'select-none')}>
      {group.title}
      <CaretIcon className="size-4 text-fg-muted transition-transform duration-150 group-open:rotate-180" />
    </summary>
    <ul className="-mt-1 pb-3 pl-3">
      {group.items.map((link) => (
        <li key={link.id}>
          <Link
            href={link.href}
            aria-current={ariaCurrent(pathname, link.href)}
            onClick={onNavigate}
            className={cn(
              'flex min-h-11 items-center text-body text-fg-muted transition-colors duration-150 hover:text-fg aria-[current]:font-medium',
              currentClass,
            )}
          >
            {link.title}
          </Link>
        </li>
      ))}
    </ul>
  </details>
);

/** The navigation sheet's rows: one per link, and a disclosure per dropdown group */
const MobileNavItems = ({ items, pathname, onNavigate }: Props) => (
  <ul className="divide-y divide-line">
    {items.map((item) => (
      <li key={item.id}>
        {item.kind === 'link' ? (
          <Link
            href={item.href}
            aria-current={ariaCurrent(pathname, item.href)}
            onClick={onNavigate}
            className={cn(rowClass, currentClass)}
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
