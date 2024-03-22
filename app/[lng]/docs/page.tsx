import Link from 'next/link';
import { Search } from 'lucide-react';
import { draftMode } from 'next/headers';
import queryDatoCMS from '@/utils/queryDatoCMS';
import {
  DocumentationHomePageDocument,
  DocumentationPageRecord,
  SiteLocale,
} from '@/graphql/types/graphql';
import { notFound } from 'next/navigation';
import FeaturedSection from '@/components/Documentaiton/FeaturedSection';

type Params = {
  params: {
    lng: SiteLocale;
  };
};

const Documentation = async ({ params: { lng } }: Params) => {
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(DocumentationHomePageDocument, {}, isEnabled);

  if (!data || !data.documentationHome) notFound();

  const titleWords = data.documentationHome.title.split(/\s+/);
  const lastWord = titleWords.pop();

  return (
    <article className="not-prose w-full max-w-none">
      <section className="not-prose relative mx-auto max-w-6xl px-6 py-16">
        <h1 className="2xl:px-30 mb-4 text-4xl font-black text-slate-900 dark:text-white md:text-6xl lg:mb-8 lg:text-center lg:leading-tight">
          {titleWords.join(' ')}
          <span className="text-primary opacity-90"> {lastWord}</span>
        </h1>
        <p className="font-bold text-slate-600 dark:text-slate-100 lg:text-center lg:text-lg">
          {data.documentationHome.subheader}
        </p>

        <div className="mx-auto flex max-w-xl flex-col justify-center gap-2 py-8 md:flex-row">
          <button
            // onClick={() => toggleCommand()}
            className="hover:ring-primary-300 flex h-10 w-full flex-row items-center gap-2 truncate rounded-xl border border-slate-300 pl-4 pr-2 text-left text-sm text-slate-500 outline-none hover:ring-2 hover:ring-offset-2 hover:ring-offset-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:ring-offset-slate-800"
          >
            <Search size={16} className="flex-none" />
            <span className="flex-1">Search Docs...</span>
            <kbd className="rounded-xl border border-slate-300 bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:border-slate-500 dark:bg-slate-700 dark:text-white">
              CTRL + K
            </kbd>
          </button>
          <Link
            href=""
            className="focus:ring-primary-400 dark:bg-primary-600 dark:hover:bg-primary-500 flex h-10 min-w-[6rem] flex-none items-center justify-center whitespace-nowrap rounded-xl bg-primary opacity-90 px-6 text-base font-medium text-white hover:bg-primary hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:ring-offset-slate-800"
          >
            Get Started
          </Link>
        </div>
      </section>
      <FeaturedSection
        featuredSections={
          data.documentationHome.featuredPages as DocumentationPageRecord[]
        }
        lng={lng}
      />
    </article>
  );
};

export default Documentation;
