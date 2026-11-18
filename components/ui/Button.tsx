import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/utils/cn';
import AppLink from './AppLink';

type Variant = 'primary' | 'secondary' | 'ink' | 'light' | 'ghost';
type Size = 'lg' | 'md' | 'sm';

type Common = {
  /**
   * primary: the accent fill, the main action of a view. secondary: white with a
   * hairline border. ink: navy, for a strong action that is not the main one.
   * On a navy panel: light (white, the main action) and ghost (translucent)
   */
  variant?: Variant;
  /** md is 44px tall, lg 50px (hero and closing call to action), sm 36px (dense chrome) */
  size?: Size;
  /** Placement only (margins, width, grid position) */
  className?: string;
  children: ReactNode;
};

type LinkProps = Common &
  Omit<ComponentProps<'a'>, 'href' | 'className' | 'children'> & {
    href: string;
  };

type ButtonProps = Common &
  Omit<ComponentProps<'button'>, 'className' | 'children'> & {
    href?: undefined;
  };

// A long CMS label wraps inside the button instead of widening the row. Motion: it rises
// 1px under the pointer and presses in a little when clicked (none under reduced motion)
const BASE =
  'inline-flex max-w-full shrink-0 items-center justify-center gap-2 rounded-full border text-center font-semibold leading-tight transition-[color,background-color,border-color,translate,scale] duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] select-none motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0 motion-safe:active:scale-[0.97] motion-safe:active:duration-100 disabled:pointer-events-none disabled:border-line disabled:bg-subtle disabled:text-fg-faint disabled:shadow-none aria-disabled:pointer-events-none aria-disabled:border-line aria-disabled:bg-subtle aria-disabled:text-fg-faint aria-disabled:shadow-none';

const VARIANT: Record<Variant, string> = {
  primary:
    'button-depth border-transparent bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'border-line bg-surface text-fg hover:border-line-strong',
  ink: 'border-transparent bg-ink text-surface hover:bg-[#1b2154]',
  light: 'border-transparent bg-surface text-fg hover:bg-tint',
  ghost: 'border-surface/25 bg-surface/10 text-surface hover:bg-surface/[0.16]',
};

const SIZE: Record<Size, string> = {
  lg: 'min-h-[3.125rem] px-6 py-2.5 text-[0.96875rem]',
  md: 'min-h-11 px-5 py-2 text-[0.9375rem]',
  sm: 'min-h-9 px-4 py-1.5 text-[0.875rem]',
};

/** The button look for an element that is neither a link nor a button (a <summary>, a <label>) */
export const buttonClass = ({
  variant = 'primary',
  size = 'md',
  className,
}: Pick<Common, 'variant' | 'size' | 'className'> = {}) =>
  cn(BASE, VARIANT[variant], SIZE[size], className);

/**
 * The site's button. With `href` it is a link (next/link for site paths, <a>
 * otherwise), without it a <button type="button">.
 */
const Button = (props: LinkProps | ButtonProps) => {
  const { variant, size, className, children, ...rest } = props;
  const classes = buttonClass({ variant, size, className });

  if (rest.href !== undefined) {
    return (
      <AppLink {...(rest as Omit<LinkProps, keyof Common>)} className={classes}>
        {children}
      </AppLink>
    );
  }

  return (
    <button
      type="button"
      {...(rest as Omit<ButtonProps, keyof Common>)}
      className={classes}
    >
      {children}
    </button>
  );
};

export default Button;
