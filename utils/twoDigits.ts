/** A counter number as the UI shows it: 5 → "05" */
export const twoDigits = (n: number) => String(n).padStart(2, '0');
