import type { CSSProperties } from 'react';
import AppLink from '@/components/ui/AppLink';
import { ArrowRightIcon } from '@/components/ui/icons';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { docsPageUrl } from '@/utils/routes';

/** A page of the overview: a section's subpages, at any depth */
type OverviewPage = {
  id: string;
  slug: string;
  title: string;
  children?: readonly (OverviewPage | null)[] | null;
};

/** A top-level page: it names a section of the docs */
type OverviewSection = OverviewPage & { subtitle?: string | null };

type Props = {
  sections: readonly OverviewSection[];
  globalPageProps: ResolvedGlobalPageProps;
  className?: string;
};

/** Every subpage of a page in reading order, with its depth under the section (0 for a direct child) */
function flatten(
  page: OverviewPage,
  depth = 0,
): { page: OverviewPage; depth: number }[] {
  return (page.children ?? [])
    .filter((child): child is OverviewPage => !!child)
    .flatMap((child) => [{ page: child, depth }, ...flatten(child, depth + 1)]);
}

/**
 * The shape of the documentation on its home page: one white card per
 * top-level section: a numbered square, the section's title and description,
 * and beside it (under it on phones) every page of the section as a row that
 * answers the pointer with an arrow, in two columns from 640px. The cards settle in as they enter the view.
 */
const DocsOverview = ({ sections, globalPageProps, className }: Props) => {
  if (!sections.length) return null;
  const { locale } = globalPageProps.params;

  return (
    <section aria-labelledby="docs-overview-title" className={className}>
      <h2
        id="docs-overview-title"
        className="reveal font-semibold text-[clamp(1.5rem,2.2vw,1.875rem)] leading-[1.1] tracking-[-0.04em]"
      >
        {uiString(locale, 'documentation')}
      </h2>
      <ul className="mt-6 grid gap-3 sm:gap-4">
        {sections.map((section, index) => {
          const groups = (section.children ?? []).filter(
            (child): child is OverviewPage => !!child,
          );

          return (
            <li
              key={section.id}
              className="reveal card grid gap-1 p-2 sm:p-3 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] md:gap-4"
            >
              <AppLink
                href={docsPageUrl(globalPageProps, section.slug)}
                className="group flex items-start gap-4 self-start rounded-[20px] p-4 transition-colors duration-150 hover:bg-subtle"
              >
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-tile bg-tint font-semibold text-accent-ink text-small tabular-nums"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 pt-0.5">
                  <h3 className="hyphens-auto text-h3">
                    <span className="title-underline">{section.title}</span>
                  </h3>
                  {section.subtitle && (
                    <p className="mt-1 text-small text-fg-muted">
                      {section.subtitle}
                    </p>
                  )}
                </div>
              </AppLink>

              {groups.length > 0 && (
                // A subpage keeps its own subpages with it when the list breaks into two columns
                <ul className="gap-x-2 border-line border-t px-1 pt-2 pb-1 sm:columns-2 md:border-t-0 md:border-s md:py-2 md:ps-4">
                  {groups.map((group) => (
                    <li key={group.id} className="break-inside-avoid">
                      <ul>
                        {[{ page: group, depth: 0 }, ...flatten(group, 1)].map(
                          ({ page, depth }) => (
                            <li key={page.id}>
                              <AppLink
                                href={docsPageUrl(globalPageProps, page.slug)}
                                style={{ '--depth': depth } as CSSProperties}
                                className={cn(
                                  'group flex min-h-10 items-center justify-between gap-3 rounded-control py-1.5 ps-[calc(0.75rem+var(--depth)*0.875rem)] pe-3 text-small transition-colors duration-150 hover:bg-subtle hover:text-fg',
                                  depth === 0 ? 'text-fg' : 'text-fg-muted',
                                )}
                              >
                                <span>{page.title}</span>
                                <ArrowRightIcon
                                  aria-hidden="true"
                                  className="size-3.5 shrink-0 text-accent-ink opacity-0 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
                                />
                              </AppLink>
                            </li>
                          ),
                        )}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default DocsOverview;
