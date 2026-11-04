import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { docsPageUrl } from '@/utils/routes';
import { toneClass } from '@/utils/tones';
import { twoDigits } from '@/utils/twoDigits';
import { PreviewCardFragment } from './fragment';

type Props = {
  fragment: FragmentOf<typeof PreviewCardFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** Position in the grid: drives the tone (tone-0 → tone-5) and the mono index */
  index?: number;
};

/** A featured docs page: tone dot and mono index, title, subtitle and an arrow disc */
const PreviewCard = ({ fragment, globalPageProps, index = 0 }: Props) => {
  const page = readFragment(PreviewCardFragment, fragment);

  return (
    <Link
      href={docsPageUrl(globalPageProps, page.slug)}
      className={cn(
        toneClass(index),
        // Below 768 the card turns into a compact row: copy left, arrow disc right
        'card card-hover group flex min-h-[176px] w-full flex-col p-6 max-md:grid max-md:min-h-0 max-md:grid-cols-[minmax(0,1fr)_auto] max-md:gap-x-4 max-md:p-5',
      )}
    >
      <span className="flex items-center">
        <span aria-hidden="true" className="dot" />
        <span aria-hidden="true" className="mono ms-auto max-md:ms-2.5">
          {twoDigits(index + 1)}
        </span>
      </span>
      <h3 className="mt-5 text-h3 text-ink max-md:mt-3">{page.title}</h3>
      {page.subtitle && (
        <p className="mt-2 line-clamp-2 text-small text-ink-2">
          {page.subtitle}
        </p>
      )}
      <span className="mt-auto pt-6 max-md:col-start-2 max-md:row-span-3 max-md:row-start-1 max-md:m-0 max-md:self-center max-md:p-0">
        <span className="grid size-8 place-items-center rounded-full bg-well text-ink-2 transition-colors duration-200 group-hover:bg-accent-solid group-hover:text-white group-focus-visible:bg-accent-solid group-focus-visible:text-white">
          <ArrowRight
            strokeWidth={1.75}
            aria-hidden="true"
            className="size-4 duration-200 ease-out-quint motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5 rtl:rotate-180"
          />
        </span>
      </span>
    </Link>
  );
};

export default PreviewCard;
