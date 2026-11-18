import { stripStega } from '@datocms/content-link';
import type { ReactNode } from 'react';
import AppLink from '@/components/ui/AppLink';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { postUrl } from '@/utils/routes';
import { hasText } from './postText';

type Props = {
  /** Raw CMS slug */
  slug?: string | null;
  globalPageProps: ResolvedGlobalPageProps;
  className?: string;
  children: ReactNode;
};

/** The post's page, or null for a post without a slug (it has no page) */
export const postPath = (
  slug: string | null | undefined,
  globalPageProps: ResolvedGlobalPageProps,
) => (hasText(slug) ? postUrl(globalPageProps, stripStega(slug).trim()) : null);

/**
 * The whole card or row as one link to the post (`group`, so its title can
 * underline on hover; `block` unless `className` sets the display). A post without a slug has no page: it renders the same
 * content without a link.
 */
const PostLink = ({ slug, globalPageProps, className, children }: Props) => {
  const href = postPath(slug, globalPageProps);
  return href ? (
    <AppLink href={href} className={cn('group', className ?? 'block')}>
      {children}
    </AppLink>
  ) : (
    <div className={className}>{children}</div>
  );
};

export default PostLink;
