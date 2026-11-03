'use client';

import Link from 'next/link';
import { useLanguageLinks } from '@/components/layout/useLanguageLinks';
import type { SiteLocale } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

type Props = {
  globalPageProps: ResolvedGlobalPageProps;
  languages: SiteLocale[];
  /** Called when a language is picked, so the menu closes */
  onNavigate: () => void;
  /** Id of the visible heading that names the list */
  labelledBy: string;
};

/** The mobile menu's language picker: a row of 44px chips, the current language in ink */
const LanguageList = ({
  globalPageProps,
  languages,
  onNavigate,
  labelledBy,
}: Props) => {
  const { links } = useLanguageLinks(globalPageProps, languages);

  return (
    <ul aria-labelledby={labelledBy} className="flex flex-wrap gap-2">
      {links.map((link) => (
        <li key={link.locale}>
          <Link
            href={link.href}
            hrefLang={link.tag}
            aria-current={link.current ? 'true' : undefined}
            onClick={onNavigate}
            className="inline-flex h-11 items-center rounded-full bg-well px-4 font-medium text-[14px] text-ink-2 transition-colors hover:bg-surface hover:text-ink aria-[current=true]:bg-ink aria-[current=true]:text-white"
          >
            <span lang={link.tag}>{link.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default LanguageList;
