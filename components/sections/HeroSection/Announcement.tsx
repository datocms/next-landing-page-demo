import { stripStega } from '@datocms/content-link';
import {
  hasChildren,
  isLink,
  isSpan,
  type Node,
} from 'datocms-structured-text-utils';
import AppLink from '@/components/ui/AppLink';
import { CaretIcon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';
import {
  hasStructuredText,
  rootNodes,
  type StructuredTextField,
} from '@/utils/structuredText';

type Props = {
  /** The hero's "Announcement" field: one line, optionally with a link */
  field: StructuredTextField | null | undefined;
  /** The hero's "Announcement badge": a short word before the line, for example New */
  label?: string | null;
  /** glass: on a navy panel or over a photo, a translucent pill with white text */
  tone?: 'default' | 'glass';
  /** Placement only */
  className?: string;
};

const PILL =
  'inline-flex min-h-8 max-w-full items-center gap-2 rounded-full py-1 pr-3 text-ui font-medium';

const TONE = {
  default: 'bg-surface text-fg shadow-[0_6px_18px_-12px_rgb(9_14_52/0.3)]',
  glass:
    'bg-[rgb(255_255_255/0.14)] text-surface shadow-[inset_0_0_0_1px_rgb(255_255_255/0.2)] backdrop-blur-md',
};

/**
 * The pill above the hero title: an optional badge and one line of text (never
 * more: it truncates). When the
 * line holds a link, the whole pill is that link. Nothing renders without text.
 */
const Announcement = ({ field, label, tone = 'default', className }: Props) => {
  if (!hasStructuredText(field)) return null;

  let text = '';
  let href: string | undefined;
  const walk = (node: Node) => {
    if (isSpan(node)) {
      text += node.value;
      return;
    }
    if (isLink(node) && !href) href = node.url;
    if (hasChildren(node)) node.children.forEach(walk);
  };
  rootNodes(field.value).forEach(walk);
  if (!stripStega(text).trim()) return null;

  const content = (
    <>
      {label && (
        <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-accent px-2.5 text-[0.75rem] font-semibold text-on-accent">
          {label}
        </span>
      )}
      {/* One line always: a long translation ends in an ellipsis instead of wrapping */}
      <span className="min-w-0 truncate">{text}</span>
      {href && (
        <CaretIcon
          className={cn(
            'size-3.5 shrink-0 -rotate-90',
            tone === 'glass' ? 'text-surface/70' : 'text-fg-muted',
          )}
        />
      )}
    </>
  );

  return href ? (
    <AppLink
      href={stripStega(href)}
      className={cn(
        PILL,
        TONE[tone],
        label ? 'pl-1' : 'pl-3',
        tone === 'glass'
          ? 'transition-colors duration-150 hover:bg-[rgb(255_255_255/0.22)]'
          : 'transition-colors duration-150 hover:text-accent-ink',
        className,
      )}
    >
      {content}
    </AppLink>
  ) : (
    <p className={cn(PILL, TONE[tone], label ? 'pl-1' : 'pl-3', className)}>
      {content}
    </p>
  );
};

export default Announcement;
