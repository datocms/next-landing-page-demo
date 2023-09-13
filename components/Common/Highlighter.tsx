import React from 'react';

const Highlighter = (rawTagName: any, props: any, ...children: any) => {
  if (rawTagName === 'mark')
    return (
      <span className={'inline rounded-sm bg-primary/20 px-1 py-1'}>
        {children}
      </span>
    );

  return React.createElement(rawTagName, props, ...children);
};

export default Highlighter;
