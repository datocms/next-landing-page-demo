import { stripStega } from '@datocms/content-link';
import { cn } from '@/utils/cn';
import Button from './Button';
import TextLink from './TextLink';

/** A Button record from the CMS (`buttons { id label primary url }`) */
type CmsButton = {
  id: string;
  label: string;
  primary: boolean;
  url: string | null;
};

type Props = {
  buttons: readonly CmsButton[];
  /** How a button without the "primary" flag renders: a secondary button (default) or a text link */
  secondary?: 'button' | 'link';
  /** lg for a hero or a closing call to action */
  size?: 'md' | 'lg';
  /** Centres the row */
  align?: 'left' | 'center';
  /** dark: on a navy panel, the primary button is white and the others translucent */
  tone?: 'default' | 'dark';
  /** Placement only */
  className?: string;
};

/**
 * A row of CMS buttons, by the site's rules: the first one flagged primary is
 * the accent button and any later primary an ink button; the others are
 * secondary buttons (or text links); from the third button on, everything is a
 * text link. A button without a URL is skipped, and the row wraps.
 */
const CmsButtons = ({
  buttons,
  secondary = 'button',
  size = 'md',
  align = 'left',
  tone = 'default',
  className,
}: Props) => {
  // stripStega: Draft Mode's invisible markers must not end up in the href
  const linked = buttons
    .map((button) => ({ ...button, href: stripStega(button.url ?? '').trim() }))
    .filter((button) => button.href);
  if (linked.length === 0) return null;

  const firstPrimary = linked.findIndex((button) => button.primary);

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-3 gap-y-3',
        align === 'center' && 'justify-center',
        className,
      )}
    >
      {linked.map((button, index) => {
        const asLink = index >= 2 || (!button.primary && secondary === 'link');
        if (asLink) {
          return (
            <TextLink
              key={button.id}
              href={button.href}
              className="inline-flex min-h-10 items-center px-2 text-[0.9375rem]"
            >
              {button.label}
            </TextLink>
          );
        }

        return (
          <Button
            key={button.id}
            href={button.href}
            size={size}
            variant={
              tone === 'dark'
                ? button.primary && index === firstPrimary
                  ? 'light'
                  : 'ghost'
                : !button.primary
                  ? 'secondary'
                  : index === firstPrimary
                    ? 'primary'
                    : 'ink'
            }
          >
            {button.label}
          </Button>
        );
      })}
    </div>
  );
};

export default CmsButtons;
