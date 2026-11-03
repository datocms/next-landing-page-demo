import { stripStega } from '@datocms/content-link';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FeaturedDocumentationPages from '@/components/docs/FeaturedDocumentationPages';
import {
  FeaturedDocumentationPagesFragment,
  PreviewCardFragment,
} from '@/components/docs/FeaturedDocumentationPages/fragment';
import { Threads } from '@/components/ui/Ornaments';
import TwoTone from '@/components/ui/SectionTitle/TwoTone';
import { readFragment } from '@/lib/datocms/graphql';
import type { ContentPage } from '@/lib/datocms/realtime/types';
import { uiString } from '@/lib/i18n/uiStrings';
import { buildUrl } from '@/utils/globalPageProps';
import type { PageProps, Query } from './meta';

const Content: ContentPage<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.documentationHome) notFound();

  const { title, subheader } = data.documentationHome;
  const { locale } = globalPageProps.params;

  const { featuredPages } = readFragment(
    FeaturedDocumentationPagesFragment,
    data.documentationHome,
  );
  // "Get started" opens the first featured page
  const firstPage = featuredPages[0]
    ? readFragment(PreviewCardFragment, featuredPages[0])
    : null;

  return (
    <>
      {/* The docs opener: a well with copy on the left and the plinth wave
          drawing in on the right. The wave box starts 560px into the well and
          fades in over its first 300px, so it only shows past the 640px title
          column; below 1360 the well is too narrow for both and it is dropped */}
      <section
        aria-labelledby="docs-title"
        className="px-(--pad) pt-10 lg:pt-12 xl:px-12"
      >
        <div className="well max-w-page px-5 py-8 md:px-10 md:py-12 lg:py-14 xl:px-12">
          <Threads
            shape="plinth"
            draw="load"
            className="top-6 left-auto hidden w-[calc(100%-560px)] [mask-image:linear-gradient(90deg,transparent_140px,#000_300px)] min-[85rem]:block rtl:right-auto rtl:left-0 rtl:-scale-x-100"
          />
          <p className="pill-label tone-2">
            {uiString(locale, 'documentation')}
          </p>
          {/* One Visual Editing target for both halves of the split title */}
          <h1
            id="docs-title"
            data-datocms-content-link-group
            className="mt-5 max-w-[640px] text-title text-ink lg:max-xl:text-[2.5rem]"
          >
            <TwoTone text={title} lineBreak="md" />
          </h1>
          {subheader && (
            <p
              data-hero-rise=""
              className="section-lead mt-5 [--d:0] [--lead-max:34rem]"
            >
              {subheader}
            </p>
          )}
          {firstPage && (
            <Link
              href={buildUrl(
                globalPageProps,
                `/docs/${stripStega(firstPage.slug)}`,
              )}
              data-hero-rise=""
              className="btn btn-primary mt-7 [--d:1]"
            >
              {uiString(locale, 'getStarted')}
              <ArrowRight
                strokeWidth={1.75}
                aria-hidden="true"
                className="btn-arrow rtl:rotate-180"
              />
            </Link>
          )}
        </div>
      </section>

      <FeaturedDocumentationPages
        fragment={data.documentationHome}
        globalPageProps={globalPageProps}
      />
    </>
  );
};

export default Content;
