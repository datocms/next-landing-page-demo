import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/utils/cn';
import AppLink from './AppLink';

type Props = Omit<ComponentProps<'a'>, 'href' | 'className' | 'children'> & {
  href: string;
  /** accent (default): the accent as text. fg: plain text colour. inherit: inside coloured text */
  tone?: 'accent' | 'fg' | 'inherit';
  /** Placement and type size */
  className?: string;
  children: ReactNode;
};

/** The underline of a text link, for links another component renders (rich text, a Link with a ref) */
export const textLinkClass =
  'underline decoration-1 underline-offset-[3px] hover:decoration-2';

const TONE = {
  accent: 'text-accent-ink font-medium hover:underline underline-offset-[3px]',
  fg: 'text-fg font-medium hover:underline underline-offset-[3px]',
  inherit: textLinkClass,
};

/**
 * A standalone link ("See all posts"): the accent as text, underlined on hover.
 * It takes the type size of its context.
 */
const TextLink = ({ tone = 'accent', className, children, ...rest }: Props) => (
  <AppLink {...rest} className={cn(TONE[tone], className)}>
    {children}
  </AppLink>
);

export default TextLink;
