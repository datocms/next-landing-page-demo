import {
  ChartLine,
  House,
  Inbox,
  Layers,
  type LucideIcon,
  Settings,
  Users,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import SkeletonBar from './SkeletonBar';

type NavItem = {
  key: string;
  Icon: LucideIcon;
  /** Width of the skeleton label */
  width: string;
  /** The current page: tinted row and accent icon */
  active?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { key: 'home', Icon: House, width: '84px' },
  { key: 'chart', Icon: ChartLine, width: '104px', active: true },
  { key: 'inbox', Icon: Inbox, width: '64px' },
  { key: 'users', Icon: Users, width: '112px' },
  { key: 'layers', Icon: Layers, width: '76px' },
  { key: 'settings', Icon: Settings, width: '56px' },
];

/** The product window's wordless sidebar: a logo row, the nav and a footer block */
const WindowSidebar = () => (
  <div
    aria-hidden="true"
    className="border-line border-r bg-well p-4 max-[900px]:hidden"
  >
    <div className="flex h-6 items-center gap-2.5 px-2">
      <i className="size-5 flex-none rounded-md bg-accent-solid" />
      <SkeletonBar className="bg-sk-2" width="72px" />
    </div>
    <ul className="mt-6 grid gap-0.5">
      {NAV_ITEMS.map(({ key, Icon, width, active }) => (
        <li
          key={key}
          className={cn(
            'flex h-8 items-center gap-2.5 rounded-lg px-2',
            active && 'bg-accent-wash',
          )}
        >
          <Icon
            strokeWidth={2}
            className={cn(
              'size-3.5 flex-none',
              active ? 'text-accent-solid' : 'text-line-strong opacity-75',
            )}
          />
          <SkeletonBar
            className={
              active
                ? 'bg-[color-mix(in_oklch,var(--accent-solid)_34%,white)]'
                : 'bg-sk-2'
            }
            width={width}
          />
        </li>
      ))}
    </ul>
    <div className="mt-7 grid gap-2.5 border-line border-t px-2 pt-3.5">
      <SkeletonBar className="h-1.5 bg-sk" width="48px" />
      <SkeletonBar className="bg-sk" width="96px" />
      <SkeletonBar className="bg-sk" width="80px" />
    </div>
  </div>
);

export default WindowSidebar;
