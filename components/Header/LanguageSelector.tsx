'use client';
import type { SiteLocale } from '@/graphql/types/graphql';
import { buildUrl } from '@/utils/globalPageProps';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import { getLangNameFromCode } from 'language-name-map';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

type Props = {
  globalPageProps: GlobalPageProps;
  languages: SiteLocale[];
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
        className="ml-4 inline-flex w-28 items-center overflow-hidden rounded-md bg-white transition duration-100 hover:bg-gray-200 active:scale-95 active:bg-gray-300"
      >
        <button
          type="button"
          className="inline-flex cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-800"
        >
          {getLangNameFromCode(currentLocale)?.name || currentLocale}
        </button>
      </div>

      <div
        className={`absolute end-0 z-10 ml-4 mt-1 w-28 rounded-md border border-gray-100 bg-white shadow-lg${
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
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                role="menuitem"
              >
                <div className="inline-flex">
                  {getLangNameFromCode(locale)?.name || currentLocale}
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
