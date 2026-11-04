import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FeaturedDocumentationPages from '@/components/docs/FeaturedDocumentationPages';
import { Threads } from '@/components/ui/Ornaments';
import TwoTone from '@/components/ui/TwoTone';
import type { ContentComponent } from '@/lib/datocms/realtime/types';
import { uiString } from '@/lib/i18n/uiStrings';
import { docsPageUrl } from '@/utils/routes';
import type { PageProps, Query } from './meta';

const Content: ContentComponent<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.documentationHome) notFound();

  const { title, subheader, featuredPages } = data.documentationHome;
  const { locale } = globalPageProps.params;
  // "Get started" opens the first featured page
  const firstPageSlug = featuredPages[0]?.slug;

  return (
    <>
      {/* The wave only fits beside the title column from 85rem up */}
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
          {firstPageSlug && (
            <Link
              href={docsPageUrl(globalPageProps, firstPageSlug)}
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
