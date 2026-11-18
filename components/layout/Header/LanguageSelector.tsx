'use client';

import Link from 'next/link';
import { useLanguageLinks } from '@/components/layout/useLanguageLinks';
import { CaretIcon, CheckIcon } from '@/components/ui/icons';
import type { SiteLocale } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { menuItemClass, menuPanelClass, useDropdown } from './useDropdown';

type Props = {
  globalPageProps: ResolvedGlobalPageProps;
  languages: SiteLocale[];
};

/** The header's language menu: the current locale's code, and every language by its own name */
const LanguageSelector = ({ globalPageProps, languages }: Props) => {
  const { currentLanguageName, links } = useLanguageLinks(
    globalPageProps,
    languages,
  );
  const { open, rootProps, triggerProps, panelProps } = useDropdown();
  const current = links.find((link) => link.current);

  return (
    <div className="relative -mr-2.5" {...rootProps}>
      <button
        {...triggerProps}
        className="group inline-flex h-9 items-center gap-1 rounded-full px-3 text-[0.875rem] font-semibold text-fg transition-colors duration-150 hover:bg-surface/70 aria-expanded:bg-surface"
        aria-label={uiString(globalPageProps.params.locale, 'currentLanguage', {
          language: currentLanguageName,
        })}
      >
        {/* The language code, as the URL writes it */}
        <span aria-hidden="true">{current?.tag.toUpperCase()}</span>
        <CaretIcon className="size-3.5 transition-transform duration-150 group-aria-expanded:rotate-180" />
      </button>

      <div {...panelProps} className={cn(menuPanelClass(open), 'right-0')}>
        <ul>
          {links.map((link) => (
            <li key={link.locale}>
              <Link
                href={link.href}
                hrefLang={link.tag}
                aria-current={link.current ? 'true' : undefined}
                className={cn(menuItemClass, 'justify-between gap-6')}
              >
                <span lang={link.tag}>{link.name}</span>
                {link.current && (
                  <CheckIcon className="size-4 shrink-0 text-accent-ink" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LanguageSelector;
