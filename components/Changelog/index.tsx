import { ChangeLogRecord, SiteLocale } from '@/graphql/types/graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import Link from 'next/link';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

type Props = {
  title: string;
  subtitle: Maybe<string>;
  featuredChangeLogs: ChangeLogRecord[];
  locale: SiteLocale;
};

const Changelog = ({ title, subtitle, featuredChangeLogs, locale }: Props) => {
  return (
    <section>
      <div className=" mx-auto flex flex-col items-center px-5 py-40">
        <div className="prose mb-20 flex w-full flex-col text-center">
          <div className="mx-auto w-full">
            <h1 className="mb-16 mt-4 text-4xl font-semibold leading-5">
              {title}
            </h1>
            <div>
              <ReactMarkdown>{subtitle || ''}</ReactMarkdown>
            </div>
          </div>
        </div>
        {featuredChangeLogs.map((changeLog) => {
          return (
            <Link
              key={changeLog.id}
              href={`/${locale}/changelog/${changeLog.slug}`}
              className="prose group mx-auto mb-2 flex cursor-pointer flex-col items-center border-b border-gray-200 py-6 sm:flex-row lg:w-1/2"
            >
              <div className="mt-6 inline-flex flex-grow items-center text-left sm:mt-0">
                <span className="pr-12 text-xs font-semibold uppercase tracking-widest text-primary group-hover:text-neutral-600">
                  {' '}
                  {changeLog.versionName}{' '}
                </span>
                <span className="ml-auto text-blue-600 group-hover:text-neutral-600">
                  »
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Changelog;
