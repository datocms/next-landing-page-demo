'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type Props = {
  href: string;
  className: string;
  children: ReactNode;
};

/** A footer link that marks itself as the current page (aria-current="page"); used by the Legal column */
const FooterPageLink = ({ href, className, children }: Props) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      aria-current={pathname === href ? 'page' : undefined}
      className={className}
    >
      {children}
    </Link>
  );
};

export default FooterPageLink;
