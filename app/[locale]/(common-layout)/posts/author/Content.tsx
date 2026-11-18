import { stripStega } from '@datocms/content-link';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { SharedElement } from '@/components/layout/PageTransition';
import PostsPageHeader from '@/components/posts/PostsPageHeader';
import { tagPillClass } from '@/components/posts/PostTags';
import AppLink from '@/components/ui/AppLink';
import { ArrowRightIcon } from '@/components/ui/icons';
import Photo from '@/components/ui/Photo';
import type { ContentComponent } from '@/lib/datocms/realtime/types';
import { uiLabel } from '@/lib/i18n/uiStrings';
import { areaLabels } from '@/utils/authorAreas';
import { cn } from '@/utils/cn';
import { authorUrl } from '@/utils/routes';
import { hasStructuredText } from '@/utils/structuredText';
import type { PageProps, Query } from './meta';

/**
 * Every author of the blog, as a pale card each, two across from 1024px: a
 * small round portrait beside the role and the name, then the bio, the areas
 * of interest as white pills, and the number of posts with a round arrow. The
 * whole card opens the author's page (the name is the link; it stretches over
 * the card) and the portrait travels there (SharedElement).
 */
const Content: ContentComponent<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  const { locale } = globalPageProps.params;

  return (
    <>
      <PostsPageHeader
        title={uiLabel(locale, 'allAuthors')}
        titleId="authors-title"
      />

      <section
        aria-labelledby="authors-title"
        className="container-page pt-12 lg:pt-16"
      >
        <ul className="grid gap-4 sm:gap-5 lg:grid-cols-2">
          {data.allAuthors.map((author) => {
            const image = author.picture?.responsiveImage;
            const href = authorUrl(globalPageProps, author.slug);
            const posts = author._allReferencingPostsMeta.count;
            const areas = areaLabels(author.areasOfInterest);

            return (
              <li
                key={author.id}
                className="group relative grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-5 rounded-card bg-subtle p-5 transition-colors duration-200 hover:bg-tint sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-x-5 sm:p-6"
              >
                <SharedElement kind="portrait" href={href}>
                  <div className="overflow-hidden rounded-full ring-4 ring-surface">
                    {image ? (
                      <Photo
                        image={image}
                        frame="square"
                        radius="none"
                        alt=""
                        focalPoint={author.picture?.focalPoint}
                        sizes="80px"
                        className="transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                      />
                    ) : (
                      <div className="aspect-square bg-tint" />
                    )}
                  </div>
                </SharedElement>

                <div className="min-w-0">
                  {author.role && (
                    <p className="text-small font-semibold text-accent-ink">
                      {author.role}
                    </p>
                  )}
                  <h2 className="mt-1 font-semibold text-[1.375rem] leading-tight tracking-[-0.03em] sm:text-[1.5rem]">
                    {/* Stretched over the card, so the whole card opens the author's page */}
                    <AppLink
                      href={href}
                      className="outline-none after:absolute after:inset-0 after:rounded-card after:outline-offset-4 after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-accent"
                    >
                      {author.name}
                    </AppLink>
                  </h2>
                </div>

                <div className="col-span-2 flex min-w-0 flex-col">
                  {hasStructuredText(author.description) && (
                    <div className="text-body text-fg-muted [&_p+p]:mt-2">
                      <DatoStructuredText data={author.description} />
                    </div>
                  )}
                  {areas.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {areas.map((area) => (
                        <li
                          key={stripStega(area)}
                          className={cn(tagPillClass, 'bg-surface!')}
                        >
                          {area}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-auto flex items-center justify-between gap-4 pt-5">
                    <p className="text-ui text-fg-muted tabular-nums">
                      {uiLabel(locale, 'postCount', { n: posts })}
                    </p>
                    <span
                      aria-hidden="true"
                      className="grid size-10 shrink-0 place-items-center rounded-full bg-surface text-accent-ink transition-colors duration-200 group-hover:bg-accent group-hover:text-on-accent"
                    >
                      <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
};

export default Content;
