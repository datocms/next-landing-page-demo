type ClassValue = string | false | null | undefined | 0;

/**
 * Joins class names, skipping falsy values. There is no tailwind-merge: two
 * utilities that set the same property don't override each other by order,
 * so shared components expose props (gap, align…) instead of accepting
 * conflicting classes.
 */
export const cn = (...values: ClassValue[]): string =>
  values.filter(Boolean).join(' ');
