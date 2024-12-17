'use client';
import type { SiteLocale } from '@/graphql/types/graphql';
import { buildUrl } from '@/utils/globalPageProps';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

type Props = {
  globalPageProps: GlobalPageProps;
  languages: SiteLocale[];
};

export const localeToLanguageName = (locale: SiteLocale): string => {
  const normalizedLocale = locale.replaceAll('_', '-');
  return (
    new Intl.DisplayNames([normalizedLocale], { type: 'language' }).of(
      normalizedLocale,
    ) ?? normalizedLocale
  );
};

const LanguageSelector = ({ globalPageProps, languages }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentLocale = globalPageProps.params.locale;
  const pathname = usePathname();
  const pathnameWithoutPrefix = pathname.replace(
    new RegExp(`^\\/${currentLocale}`),
    '',
  );

  return (
    <div className="relative">
      <div
        onClick={() => {
          isOpen ? setIsOpen(false) : setIsOpen(true);
        }}
        onBlur={() =>
          setTimeout(() => {
            setIsOpen(false);
          }, 100)
        }
        className="ml-4 w-40 inline-flex items-center overflow-hidden rounded-md bg-white transition duration-100 hover:bg-gray-200 active:scale-95 active:bg-gray-300 text-center"
      >
        <button
          type="button"
          className="inline-flex cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-800 w-full"
        >
          {localeToLanguageName(currentLocale)}
        </button>
      </div>

      <div
        className={`absolute w-40 end-0 z-10 ml-4 mt-1 rounded-md border border-gray-100 bg-white shadow-lg${
          isOpen ? '' : ' hidden'
        }`}
        role="menu"
      >
        {languages.map((locale) => {
          return (
            <div
              key={locale}
              className="inline-flex w-full cursor-pointer items-end justify-start rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              <Link
                href={buildUrl({ params: { locale } }, pathnameWithoutPrefix)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white w-full text-center"
                role="menuitem"
              >
                <div className="inline-flex">
                  {localeToLanguageName(locale)}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSelector;
