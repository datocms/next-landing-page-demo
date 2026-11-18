'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import styles from './settle.module.css';

type Props = {
  className?: string;
  children: ReactNode;
};

/**
 * A wrapper whose `[data-settle-item]` descendants fade and rise a few pixels
 * into place, once, staggered by their `--i`, when it enters the view.
 * Content already in view on load, content without JavaScript and readers who
 * prefer reduced motion see it in place at once. (Also used by the
 * integrations section.)
 */
const SettleIn = ({ className, children }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'waiting' | 'in'>('idle');

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    setState('waiting');
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setState('in');
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-settle={state} className={cn(styles.settle, className)}>
      {children}
    </div>
  );
};

export default SettleIn;
