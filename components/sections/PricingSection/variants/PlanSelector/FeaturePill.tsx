import { Check, Minus } from 'lucide-react';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';

type Props = {
  text: string;
  included: boolean;
  locale: string;
};

/** One feature of the selected plan as a pill: solid and checked when included, dashed when not */
const FeaturePill = ({ text, included, locale }: Props) => (
  <li
    className={cn(
      'inline-flex min-h-9 max-w-full items-center gap-2 rounded-pill border py-1 pr-3.5 pl-[7px] text-small leading-snug',
      included
        ? 'border-line bg-white font-medium text-ink shadow-xs'
        : 'border-line-strong/45 border-dashed text-ink-3',
    )}
  >
    <span
      aria-hidden="true"
      className={cn(
        'grid size-5 shrink-0 place-items-center rounded-full',
        included
          ? 'bg-accent-solid text-white'
          : 'bg-well text-ink-3 ring-1 ring-line ring-inset',
      )}
    >
      {included ? (
        <Check className="size-3" strokeWidth={3} />
      ) : (
        <Minus className="size-3" strokeWidth={2.5} />
      )}
    </span>
    <span className="min-w-0">
      {!included && (
        <span className="sr-only">{`${uiString(locale, 'notIncluded')} `}</span>
      )}
      {text}
    </span>
  </li>
);

export default FeaturePill;
