'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ContentLink as DatoContentLink } from 'react-datocms/content-link';

/**
 * Visual Editing in Draft Mode: Content Link click-to-edit overlays (hold
 * Alt/Option to show them), and inside the Web Previews plugin, navigation
 * kept in sync with the Next.js router
 */
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
