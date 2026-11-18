'use client';

import Link from 'next/link';
import { useLanguageLinks } from '@/components/layout/useLanguageLinks';
import type { SiteLocale } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

type Props = {
  globalPageProps: ResolvedGlobalPageProps;
  languages: SiteLocale[];
  /** Called when a language is picked, so the sheet closes */
  onNavigate: () => void;
  /** Id of the visible heading that names the list */
  labelledBy: string;
};

/** The navigation sheet's language picker: every language by its own name, the current one in the text colour */
const MobileLanguageList = ({
  globalPageProps,
  languages,
  onNavigate,
  labelledBy,
}: Props) => {
  const { links } = useLanguageLinks(globalPageProps, languages);

  return (
    <ul aria-labelledby={labelledBy} className="flex flex-wrap gap-x-5">
      {links.map((link) => (
        <li key={link.locale}>
          <Link
            href={link.href}
            hrefLang={link.tag}
            aria-current={link.current ? 'true' : undefined}
            onClick={onNavigate}
            className="inline-flex min-h-11 items-center text-body text-fg-muted transition-colors duration-150 hover:text-fg aria-[current]:font-medium aria-[current]:text-accent-ink"
          >
            <span lang={link.tag}>{link.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MobileLanguageList;
