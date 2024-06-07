import React from 'react';

export default function Highlighter(
  rawTagName: string,
  props: unknown,
  ...children: React.ReactNode[]
) {
  if (rawTagName === 'mark')
    return (
      <mark className={'inline rounded-sm bg-primary/20 px-1 py-1'}>
        {children}
      </mark>
    );

  return React.createElement(rawTagName, props as any, ...children);
}
