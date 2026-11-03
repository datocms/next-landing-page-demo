'use client';

import Link from 'next/link';
import { useLanguageLinks } from '@/components/layout/useLanguageLinks';
import type { SiteLocale } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

type Props = {
  globalPageProps: ResolvedGlobalPageProps;
  languages: SiteLocale[];
  linkClassName: string;
};

/** The footer's Language column: the current page in every locale (needs the pathname, so it is a client island) */
const FooterLanguages = ({
  globalPageProps,
  languages,
  linkClassName,
}: Props) => {
  const { links } = useLanguageLinks(globalPageProps, languages);

  return (
    <ul className="max-md:grid max-md:grid-cols-2 max-md:gap-x-(--gutter)">
      {links.map((link) => (
        <li key={link.locale}>
          <Link
            href={link.href}
            hrefLang={link.tag}
            aria-current={link.current ? 'true' : undefined}
            className={linkClassName}
          >
            <span lang={link.tag}>{link.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default FooterLanguages;
