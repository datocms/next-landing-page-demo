'use client';

import { registerUiStrings } from '@/lib/i18n/uiStrings';
import type { Dictionary } from '@/lib/i18n/uiStrings/types';

type Props = {
  locale: string;
  dictionary: Dictionary;
  children: React.ReactNode;
};

/**
 * Hands the page's interface texts to uiString in the browser (and to the
 * server render of Client Components): it fills the module-level registry
 * during render, before the children render and read from it.
 */
const UiStringsProvider = ({ locale, dictionary, children }: Props) => {
  registerUiStrings('registry', locale, dictionary);
  return children;
};

export default UiStringsProvider;
