import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

/**
 * Pull quote inside long-form content: a 2px vertical rule running tint → accent →
 * deep (grad-a → grad-b → grad-c) and 20px display text in ink (18 below 768). It
 * opts out of the prose element styles, so its own paragraph, bold and link
 * styles are set here; a <mark> inside keeps the base highlighter.
 */
const QuoteBlock = ({ children }: Props) => {
  if (!children) return null;

  return (
    <blockquote className="prose-block not-prose relative my-10 ps-6 font-display text-[1.125rem]/[1.55] tracking-[-0.01em] text-ink not-italic before:absolute before:inset-y-1 before:start-0 before:w-0.5 before:rounded-full before:bg-[linear-gradient(180deg,var(--grad-a),var(--grad-b),var(--grad-c))] md:text-[1.25rem]/[1.45] [&_a]:underline [&_a]:decoration-accent-solid/45 [&_a]:underline-offset-[3px] [&_a]:hover:decoration-accent-solid [&_p+p]:mt-4 [&_strong]:font-medium">
      {children}
    </blockquote>
  );
};

export default QuoteBlock;
