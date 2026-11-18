import { stripStega } from '@datocms/content-link';
import { cn } from '@/utils/cn';

/** A version number as it reads after the word before it: 2.0.0, v3, 1.4.2-beta */
const NUMBER = /^v?\d+(?:\.\d+)*(?:[-+][\w.-]+)?$/i;

/**
 * Splits "Version 2.0.0" into its label ("Version") and its number ("2.0.0"), so
 * the number can be set large. A name without a number at its end, or with
 * nothing before the number, comes back whole as the number (label null).
 * Draft Mode markers stay in the number, the end of the name
 */
export function splitVersion(name: string) {
  const at = name.search(/\d/);
  if (at <= 0) return { label: null, number: name };
  const label = name.slice(0, at).trim();
  const number = name.slice(at);
  if (!label || !NUMBER.test(stripStega(number).trim())) {
    return { label: null, number: name };
  }
  return { label, number };
}

type Props = {
  name: string;
  /** Classes of the number (its size); the label stays small */
  numberClassName: string;
  /** Classes of a name that is not a label and a number (a smaller size) */
  plainClassName: string;
  /** Classes of the label above the number */
  labelClassName?: string;
};

/**
 * A release's name with its number set large in tabular figures and the word
 * before it ("Version") small above it. A name that is not a number with a
 * label reads at the smaller plain size, wrapped. Put it inside the heading: the
 * heading's text stays the whole name
 */
const VersionName = ({
  name,
  numberClassName,
  plainClassName,
  labelClassName,
}: Props) => {
  const { label, number } = splitVersion(name);
  return (
    <>
      {label && (
        <span className={cn('block text-small font-medium', labelClassName)}>
          {label}
        </span>
      )}{' '}
      <span
        className={cn(
          'block font-semibold tabular-nums',
          label
            ? cn('leading-[0.95] tracking-[-0.055em]', numberClassName)
            : cn('text-balance', plainClassName),
        )}
      >
        {number}
      </span>
    </>
  );
};

export default VersionName;
