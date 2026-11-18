import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Option<Value extends string> = {
  value: Value;
  label: ReactNode;
};

type Props<Value extends string> = {
  /** Accessible name of the group ("Billing period") */
  legend: string;
  /** Name shared by the radio inputs; unique on the page */
  name: string;
  options: readonly Option<Value>[];
  value: Value;
  onChange: (value: Value) => void;
  /** Placement only */
  className?: string;
};

/**
 * A radio group drawn as a segmented control (Monthly / Yearly). The inputs
 * are native radios, so arrow keys move the choice and forms get the value;
 * the segments share the width, and one white pill slides under the selected one on a pale track. It holds state through `value` and
 * `onChange`, so render it from a client component.
 */
const Segmented = <Value extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  className,
}: Props<Value>) => {
  const selected = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  return (
    <div
      role="radiogroup"
      aria-label={legend}
      style={{ '--n': options.length, '--i': selected } as CSSProperties}
      className={cn(
        'relative inline-grid auto-cols-fr grid-flow-col rounded-chip bg-subtle p-1',
        className,
      )}
    >
      {/* The white pill: one element that slides under the selected segment */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/var(--n))] translate-x-[calc(var(--i)*100%)] rounded-chip bg-surface shadow-[0_1px_3px_rgb(9_14_52/0.16)] motion-safe:transition-[translate] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.3,0.7,0.2,1)]"
      />
      {options.map((option) => (
        <label
          key={option.value}
          className="hit-44 relative inline-flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-chip px-3.5 text-ui font-medium text-fg-muted transition-colors duration-200 not-has-checked:hover:text-fg has-checked:text-fg has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-ink"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default Segmented;
