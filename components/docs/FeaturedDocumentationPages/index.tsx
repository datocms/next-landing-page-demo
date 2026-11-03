import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { FeaturedDocumentationPagesFragment } from './fragment';
import PreviewCard from './PreviewCard';

type Props = {
  fragment: FragmentOf<typeof FeaturedDocumentationPagesFragment>;
  globalPageProps: ResolvedGlobalPageProps;
};

/** The docs home's grid of featured pages, one numbered card each */
const FeaturedDocumentationPages = ({ fragment, globalPageProps }: Props) => {
  const { featuredPages } = readFragment(
    FeaturedDocumentationPagesFragment,
    fragment,
  );

  if (!featuredPages.length) return null;

  return (
    <section
      aria-labelledby="featured-docs-title"
      className="px-(--pad) pt-8 pb-24 max-md:pt-6 max-md:pb-16 xl:px-12"
    >
      <h2 id="featured-docs-title" className="sr-only">
        {uiString(globalPageProps.params.locale, 'featuredPages')}
      </h2>
      <ul className="reveal-stagger grid max-w-page gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-3">
        {featuredPages.map((page, index) => (
          <li key={page.id} className="flex">
            <PreviewCard
              fragment={page}
              index={index}
              globalPageProps={globalPageProps}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FeaturedDocumentationPages;
