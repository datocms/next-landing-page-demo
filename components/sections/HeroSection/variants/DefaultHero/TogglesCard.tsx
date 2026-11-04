import { cn } from '@/utils/cn';

type Props = {
  /** Position and motion, set by the caller */
  className?: string;
};

/** A settings switch; `on` fills the track with the tone gradient */
const Switch = ({ on }: { on?: boolean }) => (
  <span
    className={cn(
      'relative h-[18px] w-8 flex-none rounded-[9px]',
      on
        ? 'bg-[linear-gradient(90deg,var(--tone-hi),var(--tone))]'
        : 'bg-surface',
    )}
  >
    <span
      className={cn(
        'absolute top-0.5 size-3.5 rounded-full bg-white',
        on
          ? 'left-4'
          : 'left-0.5 shadow-[0_1px_2px_color-mix(in_oklch,var(--ink)_20%,transparent)]',
      )}
    />
  </span>
);

/** A wordless settings card with one switch on and one off. Decorative */
const TogglesCard = ({ className }: Props) => (
  <div
    aria-hidden="true"
    className={cn(
      'float tone-3 grid h-[104px] w-52 content-between rounded-zone p-4',
      className,
    )}
  >
    <div className="flex h-8 items-center justify-between">
      <span className="h-2 w-24 rounded-full bg-surface" />
      <Switch on />
    </div>
    <div className="flex h-9 items-center justify-between border-line border-t pt-1">
      <span className="h-2 w-[72px] rounded-full bg-surface" />
      <Switch />
    </div>
  </div>
);

export default TogglesCard;
