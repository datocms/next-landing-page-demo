const SUFFIXES = ['', 'k', 'M', 'B', 'T'] as const;

/**
 * Compact figures with at most three significant digits, so a numeral never
 * outgrows its tile: 48 → 48, 1500 → 1.5k, 562340 → 562k, 999999 → 1M,
 * 3400000 → 3.4M, 2100000000 → 2.1B.
 */
export function formatCompactNumber(num: number) {
  let value = Math.abs(num);
  let tier = 0;
  while (value >= 1000 && tier < SUFFIXES.length - 1) {
    value /= 1000;
    tier += 1;
  }
  let rounded = Number(value.toFixed(value >= 100 || tier === 0 ? 0 : 1));
  // Rounding can reach the next tier: 999.95k is 1M, not 1000k
  if (rounded >= 1000 && tier < SUFFIXES.length - 1) {
    rounded = 1;
    tier += 1;
  }
  return `${num < 0 ? '-' : ''}${rounded}${SUFFIXES[tier]}`;
}
