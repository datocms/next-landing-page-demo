'use client';

import { SiteLocale } from '@/graphql/types/graphql';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { getLangNameFromCode } from 'language-name-map';

type Props = {
  lng: SiteLocale;
  languages: SiteLocale[];
};

const LanguageSelector = ({ lng, languages }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const pathArray = pathname.split('/');
  const currentLocale = pathArray[1] as SiteLocale; //will be a SiteLocale because of the middleware redirect rules

  const pathString = pathArray.splice(2, pathArray.length).join('/');

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
        <button className="inline-flex cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-800">
          {getLangNameFromCode(currentLocale)?.name || currentLocale}
        </button>
      </div>

      <div
        className={
          'absolute end-0 z-10 ml-4 mt-1 w-28 rounded-md border border-gray-100 bg-white shadow-lg' +
          (isOpen ? '' : ' hidden')
        }
        role="menu"
      >
        {languages.map((locale) => {
          return (
            <div
              key={locale}
              className="inline-flex w-full cursor-pointer items-end justify-start rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              <Link
                href={'/' + locale + '/' + pathString}
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

//if the current dir is /posts/ or /legal/
//if the current page has a slug
//try to fetch the slug in the new locale, if it doesn't return any, redirect the user to a 404
//if it does return one, redirect the user to it
