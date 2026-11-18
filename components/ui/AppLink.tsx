import Link from 'next/link';
import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<'a'>, 'href'> & {
  href: string;
};

/** A path of this site (`/en/pricing`), as opposed to a URL with a scheme, `//host` or `#anchor` */
const isSitePath = (href: string) => /^\/(?!\/)/.test(href);

/**
 * One link for every destination: next/link (client navigation, prefetch) for
 * site paths, a plain <a> for everything else. Button and TextLink render it,
 * so sections rarely need it directly.
 */
const AppLink = ({ href, ...rest }: Props) =>
  isSitePath(href) ? (
    <Link href={href} {...rest} />
  ) : (
    <a href={href} {...rest} />
  );

export default AppLink;
