import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

type Props = {
  /** md: hero (176×48, 156×44 below 768); sm: in-article image CTA (132×40) */
  size?: 'md' | 'sm';
  /** Position (absolute left-… top-…, z-…), set by the caller */
  className?: string;
};

/** Wordless "people are here" float: stacked tone avatars, a bar and a check. Decorative */
const PresencePill = ({ size = 'md', className }: Props) => {
  if (size === 'sm') {
    return (
      <div
        aria-hidden="true"
        className={cn(
          'float flex h-10 w-[132px] items-center gap-2 rounded-full pr-3 pl-2',
          className,
        )}
      >
        <span className="flex">
          <i className="tone-0 size-6 rounded-full bg-tone-grad shadow-[0_0_0_2px_#fff]" />
          <i className="tone-1 -ml-2 size-6 rounded-full bg-tone-grad shadow-[0_0_0_2px_#fff]" />
          <i className="tone-2 -ml-2 size-6 rounded-full bg-tone-grad shadow-[0_0_0_2px_#fff]" />
        </span>
        <span className="tone-2 ml-auto grid size-3.5 flex-none place-items-center rounded-full bg-tone-grad text-white">
          <Check className="size-[9px]" strokeWidth={3.2} />
        </span>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        'float flex h-12 w-44 items-center gap-3 rounded-full pr-4 pl-[11px] max-md:h-11 max-md:w-39 max-md:gap-2.5 max-md:pr-3 max-md:pl-[9px]',
        className,
      )}
    >
      <span className="flex">
        <i className="tone-0 size-[26px] rounded-full bg-tone-grad shadow-[0_0_0_2px_#fff] max-md:size-6" />
        <i className="tone-1 -ml-2 size-[26px] rounded-full bg-tone-grad shadow-[0_0_0_2px_#fff] max-md:size-6" />
        <i className="tone-2 -ml-2 size-[26px] rounded-full bg-tone-grad shadow-[0_0_0_2px_#fff] max-md:size-6" />
        <i className="tone-3 -ml-2 size-[26px] rounded-full bg-tone-grad shadow-[0_0_0_2px_#fff] max-md:size-6" />
      </span>
      <span className="h-2 flex-1 rounded-full bg-surface" />
      <span className="tone-2 grid size-4 flex-none place-items-center rounded-full bg-tone-grad text-white">
        <Check className="size-2.5" strokeWidth={3.2} />
      </span>
    </div>
  );
};

export default PresencePill;
