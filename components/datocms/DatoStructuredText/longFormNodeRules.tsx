import { isBlockquote, isCode } from 'datocms-structured-text-utils';
import { renderNodeRule } from 'react-datocms/structured-text';
import CodeBlock from '@/components/ui/CodeBlock';
import QuoteBlock from '@/components/ui/QuoteBlock';

/** Pull quotes and code windows, shared by posts, docs, legal and changelog pages */
export const longFormNodeRules = (locale: string) => [
  renderNodeRule(isBlockquote, ({ children, key }) => (
    <QuoteBlock key={key}>{children}</QuoteBlock>
  )),
  renderNodeRule(isCode, ({ node, key }) => (
    <CodeBlock
      key={key}
      code={node.code}
      language={node.language}
      highlight={node.highlight}
      locale={locale}
    />
  )),
];
