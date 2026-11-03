'use client';

import { Check, ChevronDown, Globe } from 'lucide-react';
import Link from 'next/link';
import { useLanguageLinks } from '@/components/layout/useLanguageLinks';
import type { SiteLocale } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { panelStateClass, useDropdown } from './useDropdown';

type Props = {
  globalPageProps: ResolvedGlobalPageProps;
  languages: SiteLocale[];
};

/** Desktop header control: a round secondary pill + menu panel */
const LanguageSelector = ({ globalPageProps, languages }: Props) => {
  const { currentLanguageName, links } = useLanguageLinks(
    globalPageProps,
    languages,
  );
  const { open, rootProps, triggerProps, panelProps } = useDropdown();

  return (
    <div className="relative" {...rootProps}>
      <button
        {...triggerProps}
        className="group btn btn-secondary btn-sm pr-3 pl-[11px] text-[14px] text-ink-2 hover:text-ink aria-expanded:text-ink aria-expanded:shadow-[inset_0_0_0_1px_var(--line-strong),var(--shadow-xs)]"
        aria-label={uiString(globalPageProps.params.locale, 'currentLanguage', {
          language: currentLanguageName,
        })}
      >
        <Globe strokeWidth={1.75} aria-hidden="true" className="size-[15px]" />
        <span>{currentLanguageName}</span>
        <ChevronDown
          strokeWidth={1.75}
          aria-hidden="true"
          className="transition-transform duration-200 group-aria-expanded:rotate-180"
        />
      </button>

      <div
        {...panelProps}
        className={cn(
          'menu-panel absolute top-[calc(100%+8px)] right-0 min-w-46',
          panelStateClass(open),
        )}
      >
        <ul>
          {links.map((link) => (
            <li key={link.locale}>
              <Link
                href={link.href}
                hrefLang={link.tag}
                aria-current={link.current ? 'true' : undefined}
                className="menu-item justify-between"
              >
                <span lang={link.tag}>{link.name}</span>
                {link.current && (
                  <Check
                    strokeWidth={2.25}
                    aria-hidden="true"
                    className="size-[15px] shrink-0 text-accent-solid"
                  />
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
