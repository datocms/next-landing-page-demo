import { type ReactNode, ViewTransition } from 'react';

/** Fades its content out and in on navigations; refreshes and draft updates stay still (styles/components/motion.css) */
const PageTransition = ({ children }: { children: ReactNode }) => (
  <ViewTransition enter="page-enter" exit="page-exit" default="none">
    {children}
  </ViewTransition>
);

export default PageTransition;
