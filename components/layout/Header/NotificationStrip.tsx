import { stripStega } from '@datocms/content-link';
import { isLink } from 'datocms-structured-text-utils';
import { ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import type { Ref } from 'react';
import { renderNodeRule } from 'react-datocms/structured-text';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import type { ResultOf } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { buildUrl } from '@/utils/routes';
import type { HeaderFragment } from './fragment';

type Props = {
  notification?: ResultOf<typeof HeaderFragment>['notification'];
  globalPageProps: ResolvedGlobalPageProps;
  onDismiss: () => void;
  /** Lets the header measure the bar, so its hairline only shows once the bar has scrolled away */
  ref?: Ref<HTMLElement>;
};

/** A URL with a scheme (https:, mailto:…) or a protocol-relative one */
const ABSOLUTE_URL = /^([a-z][a-z\d+.-]*:|\/\/)/i;

/** Only site paths get the locale prefix; absolute URLs (https:, mailto:, //…) and #anchors are used as is */
const linkHref = (url: string, globalPageProps: ResolvedGlobalPageProps) =>
  ABSOLUTE_URL.test(url) || url.startsWith('#')
    ? url
    : buildUrl(globalPageProps, url.startsWith('/') ? url : `/${url}`);

/**
 * White announcement bar above the header, closed by a 2px accent hairline.
 * It scrolls away with the page and can be dismissed for the visit.
 */
const NotificationStrip = ({
  notification,
  globalPageProps,
  onDismiss,
  ref,
}: Props) => {
  const { locale } = globalPageProps.params;

  // A link that ends its paragraph gets a trailing arrow
  const renderLink = renderNodeRule(
    isLink,
    ({ node, children, key, ancestors }) => {
      const parent = ancestors[0];
      const endsParagraph =
        parent &&
        'children' in parent &&
        parent.children[parent.children.length - 1] === node;

      return (
        <Link
          href={linkHref(stripStega(node.url), globalPageProps)}
          className="hit-44 whitespace-nowrap rounded-sm font-medium text-ink underline decoration-1 decoration-ink/35 underline-offset-[3px] transition-colors hover:decoration-current"
          key={key}
        >
          {children}
          {endsParagraph && (
            <ArrowRight
              strokeWidth={2}
              aria-hidden="true"
              className="ml-0.5 inline-block size-3.5 align-[-0.15em] rtl:rotate-180"
            />
          )}
        </Link>
      );
    },
  );

  return (
    <section
      ref={ref}
      aria-label={uiString(locale, 'announcement')}
      className="relative bg-white"
      style={{ viewTransitionName: 'site-strip' }}
    >
      {/* Below 768 the text sits left to clear the close button */}
      <div className="container-page flex min-h-9 items-center justify-center py-1.5 text-center text-[13.5px]/[1.4] text-ink-2 max-md:min-h-11 max-md:justify-start max-md:pr-12 max-md:text-left max-md:text-[13px] md:px-10 pointer-coarse:min-h-11">
        <div className="text-pretty [&>div>p:first-child]:inline [&>div]:inline">
          <DatoStructuredText
            data={notification}
            customNodeRules={[renderLink]}
          />
        </div>
      </div>
      <button
        type="button"
        aria-label={uiString(locale, 'dismissAnnouncement')}
        onClick={onDismiss}
        className="absolute top-[18px] right-[max(4px,calc((100%-var(--container))/2-10px))] grid size-9 -translate-y-1/2 place-items-center rounded-full text-ink-3 transition-colors hover:bg-well hover:text-ink max-md:top-[22px] max-md:right-1 max-md:size-11 pointer-coarse:top-[22px] pointer-coarse:size-11"
      >
        <X className="size-[15px]" strokeWidth={2} aria-hidden="true" />
      </button>
      <div aria-hidden="true" className="hairline" />
    </section>
  );
};

export default NotificationStrip;
