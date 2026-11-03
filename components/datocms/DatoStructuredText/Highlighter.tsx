import React from 'react';

/**
 * A StructuredText `renderNode`: every node renders as its plain tag, and the
 * `highlight` mark as a bare <mark>
 */
export default function Highlighter(
  rawTagName: string,
  props: Record<string, unknown>,
  ...children: React.ReactNode[]
) {
  if (rawTagName === 'mark')
    // Unstyled on purpose: the base `mark` rule in styles/base.css paints the
    // accent highlighter (and .prose adds the scroll-driven sweep)
    return <mark key={props?.key as string}>{children}</mark>;

  return React.createElement(
    rawTagName,
    props as React.HTMLAttributes<HTMLElement>,
    ...children,
  );
}
