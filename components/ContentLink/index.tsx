'use client';

import { ContentLink as DatoContentLink } from 'react-datocms/content-link';
import { useRouter, usePathname } from 'next/navigation';

export default function ContentLink() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DatoContentLink
      onNavigateTo={(path) => router.push(path)}
      currentPath={pathname}
    />
  );
}
