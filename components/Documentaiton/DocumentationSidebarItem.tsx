'use client';

import { DocumentationPageRecord, SiteLocale } from '@/graphql/generated';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  page: DocumentationPageRecord;
  lng: SiteLocale;
};

const DocumentationSidebarItem = ({ page, lng }: Props) => {
  const pathname = usePathname();
  const currentSlug = pathname.split('/')[pathname.split('/').length - 1];

  const activeClass =
    'flex cursor-pointer items-center rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700';
  const inactiveClass =
    'flex cursor-pointer items-center rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700';

  let isActive = currentSlug === page.slug;

  if (!page.children || !page.children.length) {
    return (
      <li>
        <Link
          href={`/${lng}/docs/${page.slug}`}
          className={isActive ? activeClass : inactiveClass}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
          {page.title}
        </Link>
      </li>
    );
  }

  if (
    page.children?.find(
      (child) =>
        child!.slug === currentSlug ||
        child?.children?.find((child) => child?.slug === currentSlug) //todo make this recursive later
    )
  )
    isActive = true;

  return (
    <li>
      <Link href={`/${lng}/docs/${page.slug}`}>
        <summary
          className={(isActive ? activeClass : inactiveClass) + ' gap-1'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <span
            className={
              !(currentSlug === page.slug) ? 'font-normal text-gray-500' : ''
            }
          >
            {' '}
            {page.title}{' '}
          </span>
        </summary>
      </Link>

      <AnimatePresence>
        {isActive && (
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { ease: 'linear', duration: 0.1, delay: 0.2 },
            }}
            exit={{
              opacity: 0,
              y: -20,
              transition: { duration: 0.1, ease: 'linear' },
            }}
            className="mt-2 space-y-1 pl-10"
          >
            {page.children.map((child) => {
              const childPage = child as DocumentationPageRecord;
              return (
                <DocumentationSidebarItem
                  lng={lng}
                  key={childPage.id}
                  page={childPage}
                />
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

export default DocumentationSidebarItem;
