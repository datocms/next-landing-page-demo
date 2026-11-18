import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import DocsOverview from '@/components/docs/DocsOverview';
import FeaturedDocumentationPages from '@/components/docs/FeaturedDocumentationPages';
import AppLink from '@/components/ui/AppLink';
import { ArrowRightIcon } from '@/components/ui/icons';
import type { ContentComponent } from '@/lib/datocms/realtime/types';
import { uiString } from '@/lib/i18n/uiStrings';
import { docsPageUrl } from '@/utils/routes';
import { titleSize } from '@/utils/titleSize';
import type { PageProps, Query } from './meta';

const arrive = (step: number) =>
  ({ '--arrive': `${step * 90}ms` }) as CSSProperties;

/**
 * The documentation home: an opening panel (the tinted panel with the site's
 * faint corner rings: the title large, the subtitle, and the first page of the
 * docs as a white tile to start from), the featured pages as a mosaic of
 * coloured tiles, and the whole documentation by section.
 */
const Content: ContentComponent<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.documentationHome) notFound();

  const { title, subtitle } = data.documentationHome;
  const { locale } = globalPageProps.params;
  const scale = titleSize(title, 'display');
  const firstPage = data.allDocumentationPages[0];

  return (
    <div className="pt-6 lg:pt-8">
      <div className="panel-tint relative isolate overflow-hidden rounded-frame px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
        <span
          aria-hidden="true"
          style={
            { '--loop-time': '36s', '--loop-scale': 1.06 } as CSSProperties
          }
          className="breathe loop pointer-events-none absolute -top-[110px] -right-[110px] -z-10 size-[220px] rounded-full shadow-[0_0_0_56px_rgb(255_255_255/0.45),0_0_0_118px_rgb(255_255_255/0.3),0_0_0_186px_rgb(255_255_255/0.18)] max-sm:-top-[150px] max-sm:-right-[150px]"
        />

        <p
          className="arrive text-small font-medium text-accent-ink"
          style={arrive(0)}
        >
          {uiString(locale, 'documentation')}
        </p>
        <h1
          className={`arrive mt-3 max-w-[18ch] text-balance ${scale.className}`}
          data-long={scale.long}
          style={arrive(1)}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="arrive mt-4 max-w-[48ch] text-balance text-lead text-fg-muted"
            style={arrive(2)}
          >
            {subtitle}
          </p>
        )}

        {firstPage && (
          <AppLink
            href={docsPageUrl(globalPageProps, firstPage.slug)}
            className="arrive group mt-9 flex max-w-[30rem] items-center gap-4 rounded-card bg-surface p-3 pe-6 shadow-soft transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-safe:hover:-translate-y-0.5 sm:mt-10"
            style={arrive(3)}
          >
            <span
              aria-hidden="true"
              className="grid size-14 shrink-0 place-items-center rounded-[20px] bg-accent text-on-accent"
            >
              <ArrowRightIcon className="size-5 transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:translate-x-0.5" />
            </span>
            <span className="min-w-0">
              <span className="block text-h3">
                <span className="title-underline">{firstPage.title}</span>
              </span>
              {firstPage.subtitle && (
                <span className="mt-0.5 block text-small text-fg-muted">
                  {firstPage.subtitle}
                </span>
              )}
            </span>
          </AppLink>
        )}
      </div>

      <FeaturedDocumentationPages
        fragment={data.documentationHome}
        globalPageProps={globalPageProps}
        className="mt-16 lg:mt-20"
      />

      <DocsOverview
        sections={data.allDocumentationPages}
        globalPageProps={globalPageProps}
        className="mt-16 lg:mt-20"
      />
    </div>
  );
};

export default Content;
