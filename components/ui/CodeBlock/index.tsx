import { stripStega } from '@datocms/content-link';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import { uiString } from '@/lib/i18n/uiStrings';
import CopyButton from './CopyButton';

// The light build ships only the grammars registered here. Any other language
// renders as plain text in the same window.
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('xml', xml);

type Props = {
  code: string;
  language?: string | null;
  /** Zero-based line indexes to highlight, counted from the original first line */
  highlight?: readonly number[] | null;
  /** Site locale for the copy button's label (English when missing) */
  locale?: string | null;
};

/** CMS language names (and common aliases) → a registered grammar */
const GRAMMAR_BY_LANGUAGE = new Map<string, string>([
  ['bash', 'bash'],
  ['sh', 'bash'],
  ['shell', 'bash'],
  ['zsh', 'bash'],
  ['console', 'bash'],
  ['css', 'css'],
  ['javascript', 'javascript'],
  ['js', 'javascript'],
  ['jsx', 'javascript'],
  ['mjs', 'javascript'],
  ['cjs', 'javascript'],
  ['json', 'json'],
  ['typescript', 'typescript'],
  ['ts', 'typescript'],
  ['tsx', 'typescript'],
  ['xml', 'xml'],
  ['html', 'xml'],
  ['svg', 'xml'],
]);

/**
 * A code window for long-form content (docs, posts, legal and changelog
 * entries): a tinted bar with window dots, a mono language label and the copy
 * action, over highlighted code that scrolls sideways inside the window.
 */
const CodeBlock = ({ code, language, highlight, locale }: Props) => {
  // Drop blank lines around the snippet; highlight indexes count from the
  // original first line, so they are shifted by the lines removed on top
  const leadingBlankLines = code.match(/^\n*/)?.[0].length ?? 0;
  const trimmedCode = code.slice(leadingBlankLines).replace(/\n+$/, '');
  const languageKey = stripStega(language ?? '')
    .trim()
    .toLowerCase();
  const grammar = GRAMMAR_BY_LANGUAGE.get(languageKey) ?? 'text';

  return (
    <div className="code-block not-prose my-7 overflow-hidden rounded-zone border border-line bg-white shadow-xs">
      <div className="flex h-10 items-center gap-3 border-b border-line bg-well ps-4 pe-1.5 pointer-coarse:h-12">
        <span aria-hidden="true" className="window-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="mono">{language || 'code'}</span>
        <CopyButton
          code={stripStega(trimmedCode)}
          label={uiString(locale, 'copy')}
          copiedLabel={uiString(locale, 'copied')}
          accessibleLabel={uiString(locale, 'copyCode')}
          className="ms-auto"
        />
      </div>
      <SyntaxHighlighter
        language={grammar}
        useInlineStyles={false}
        wrapLines
        showLineNumbers
        lineNumberStyle={{ display: 'none' }}
        lineProps={(lineNumber) => ({
          className: highlight?.includes(lineNumber - 1 + leadingBlankLines)
            ? 'is-highlighted'
            : undefined,
        })}
        className="m-0 overflow-x-auto bg-white px-5 py-4 font-mono text-[13px] leading-[1.7] text-ink"
        codeTagProps={{ className: 'block min-w-max' }}
      >
        {trimmedCode}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
