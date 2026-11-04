import { Check, Minus } from 'lucide-react';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';

type Props = {
  text: string;
  included: boolean;
  locale: string;
  /** md in plan cards, sm in tables and compact cards */
  size?: 'md' | 'sm';
};

/** One feature row of a pricing plan: a check (or minus) disc and the text. Render inside a <ul> */
const PlanFeature = ({ text, included, locale, size = 'md' }: Props) => {
  const Icon = included ? Check : Minus;

  return (
    <li
      className={cn(
        'flex min-h-7 items-center gap-2.5 leading-[1.45]',
        size === 'md' ? 'text-[0.90625rem]' : 'text-small',
        included ? 'text-ink' : 'text-ink-3',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'grid shrink-0 place-items-center self-start rounded-full',
          size === 'md' ? 'mt-[5px] size-[18px]' : 'mt-1.5 size-4',
          included
            ? 'bg-accent-wash text-accent-solid'
            : 'bg-well text-ink-3 ring-1 ring-line ring-inset',
        )}
      >
        <Icon
          className={size === 'md' ? 'size-[11px]' : 'size-2.5'}
          strokeWidth={3}
        />
      </span>
      <span className="py-0.5">
        {!included && (
          <span className="sr-only">{`${uiString(locale, 'notIncluded')} `}</span>
        )}
        {text}
      </span>
    </li>
  );
};

export default PlanFeature;
