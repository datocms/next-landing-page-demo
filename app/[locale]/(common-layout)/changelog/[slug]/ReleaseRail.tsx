import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import { toneClass } from '@/utils/tones';

export type Release = {
  id: string;
  versionName: string;
  href: string;
  date: { iso: string; label: string } | null;
  isCurrent: boolean;
};

type Props = {
  /** Every release, newest first */
  releases: Release[];
  changelogHref: string;
  locale: string;
};

/**
 * The entry's side rail: a link back to the changelog, then every release
 * (a scrollable row of chips on phones and tablets, a timeline from lg) with
 * the open one lit
 */
const ReleaseRail = ({ releases, changelogHref, locale }: Props) => (
  <aside
    style={{ viewTransitionName: 'changelog-rail' }}
    className="max-lg:max-w-reading lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-3 lg:self-start"
  >
    <Link href={changelogHref} className="btn btn-secondary btn-sm">
      <ArrowLeft
        strokeWidth={1.75}
        aria-hidden="true"
        className="btn-arrow-back rtl:rotate-180"
      />
      {uiString(locale, 'changelog')}
    </Link>

    {releases.length > 1 && (
      <nav
        aria-label={uiString(locale, 'releases')}
        className="mt-4 lg:mt-6 lg:max-h-[calc(100svh-var(--header-h)-7rem)] lg:overflow-y-auto"
      >
        {/* Phones and tablets: one scrollable row of versions */}
        <ol className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:hidden">
          {releases.map((release) => (
            <li key={release.id} className="shrink-0">
              <Link
                href={release.href}
                aria-current={release.isCurrent ? 'page' : undefined}
                className={cn(
                  'btn btn-sm',
                  release.isCurrent ? 'btn-primary' : 'btn-secondary',
                )}
              >
                {release.versionName}
              </Link>
            </li>
          ))}
        </ol>

        {/* Desktop: the same timeline rail as the changelog section */}
        <ol
          className="changelog-rail hidden gap-1 lg:grid lg:auto-rows-fr"
          style={
            {
              '--rail-rows': releases.length,
              '--rail-gap': '4px',
            } as CSSProperties
          }
        >
          {releases.map((release, index) => (
            <li
              key={release.id}
              data-current={release.isCurrent ? '' : undefined}
              className={cn(toneClass(index), 'group relative ps-8')}
            >
              <span
                aria-hidden="true"
                className="absolute start-[7px] top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-tone-grad shadow-[0_0_0_3px_var(--bg),0_0_0_4px_var(--line)] group-data-current:shadow-[0_0_0_3px_var(--bg),0_0_0_5px_var(--color-accent-solid)]"
              />
              <Link
                href={release.href}
                aria-current={release.isCurrent ? 'page' : undefined}
                className="block rounded-[10px] px-3 py-2 transition-colors duration-150 hover:bg-well group-data-current:bg-well"
              >
                <span className="block truncate font-medium text-[0.9375rem]/[1.35] text-ink-2 group-hover:text-ink group-data-current:text-ink">
                  {release.versionName}
                </span>
                {release.date && (
                  <time
                    dateTime={release.date.iso}
                    className="mono mt-0.5 block"
                  >
                    {release.date.label}
                  </time>
                )}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    )}
  </aside>
);

export default ReleaseRail;
