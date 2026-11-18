import { stripStega } from '@datocms/content-link';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
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
  locale: string;
  /**
   * `docs`: the documentation's block: the language as a small mono pill, a
   * copy button with a glyph that turns into a check, roomier padding
   */
  variant?: 'default' | 'docs';
};

/** CMS language names (and common aliases) → a registered grammar */
const GRAMMAR_BY_LANGUAGE = new Map<string, string>([
  ['bash', 'bash'],
  ['sh', 'bash'],
  ['shell', 'bash'],
  ['zsh', 'bash'],
  ['console', 'bash'],
  ['css', 'css'],
  ['scss', 'css'],
  ['sass', 'css'],
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
 * A code block for long-form content (docs, posts, legal and changelog
 * entries): pale mono text on navy (bg-ink) with the tile radius; a bar on
 * top with the language as small dimmed text when the CMS names one and a
 * "Copy" button. Long lines scroll sideways inside the
 * block. The monochrome syntax theme is in styles/prose.css.
 */
const CodeBlock = ({
  code,
  language,
  highlight,
  locale,
  variant = 'default',
}: Props) => {
  const docs = variant === 'docs';
  // Drop blank lines around the snippet; highlight indexes count from the
  // original first line, so they are shifted by the lines removed on top
  const leadingBlankLines = code.match(/^\n*/)?.[0].length ?? 0;
  const trimmedCode = code.slice(leadingBlankLines).replace(/\n+$/, '');
  const languageKey = stripStega(language ?? '')
    .trim()
    .toLowerCase();
  const grammar = GRAMMAR_BY_LANGUAGE.get(languageKey) ?? 'text';

  return (
    <div
      className={cn(
        'code-block not-prose on-ink my-8 overflow-hidden bg-ink text-surface',
        docs ? 'rounded-[20px]' : 'rounded-tile',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between gap-3 border-surface/10 border-b',
          docs
            ? 'h-12 ps-4 pe-2 pointer-coarse:h-14'
            : 'h-10 ps-5 pe-1.5 pointer-coarse:h-12',
        )}
      >
        {languageKey ? (
          <span
            className={cn(
              docs
                ? 'inline-flex h-6 items-center rounded-chip bg-surface/8 px-2.5 font-mono text-[0.75rem] text-surface/75'
                : 'text-ui text-surface/60',
            )}
          >
            {language}
          </span>
        ) : (
          <span />
        )}
        <CopyButton
          code={stripStega(trimmedCode)}
          label={uiString(locale, 'copy')}
          copiedLabel={uiString(locale, 'copied')}
          accessibleLabel={uiString(locale, 'copyCode')}
          withIcon={docs}
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
        className={cn(
          'm-0 overflow-x-auto overscroll-x-contain font-mono leading-[1.7] text-surface/90 focus-visible:-outline-offset-2',
          docs ? 'px-5 py-5 text-[0.875rem]' : 'px-5 py-4 text-small',
        )}
        codeTagProps={{ className: 'block min-w-max' }}
        tabIndex={0}
      >
        {trimmedCode}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
