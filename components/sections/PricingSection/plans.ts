import { stripStega } from '@datocms/content-link';
import { type Tone, toneRamp } from '@/utils/tones';

/** One line of a plan's feature list; `included: false` marks a feature only richer plans have */
type FeatureRow = { key: string; text: string; included: boolean };

/** The visible text of a feature, for comparing features across plans */
const comparableText = (feature: string) =>
  stripStega(feature).trim().toLowerCase();

/** planFeatures is a comma separated string in the CMS ("Email support, Commercial use") */
export const splitFeatures = (planFeatures?: string | null) =>
  planFeatures
    ? planFeatures
        .split(/\s*,\s*/)
        .map((feature) => feature.trim())
        .filter(Boolean)
    : [];

/**
 * One row list per plan. When every plan's features are a subset of the
 * richest plan (cumulative tiers, as in the demo content), each plan lists the
 * richest plan's features in its order, marking the ones it lacks as excluded,
 * so the lists line up across plans. Otherwise each plan lists only its own.
 */
export function planFeatureRows(
  plans: { id: string; planFeatures?: string | null }[],
): FeatureRow[][] {
  const featureLists = plans.map((plan) => splitFeatures(plan.planFeatures));
  const ownRows = (planIndex: number) =>
    featureLists[planIndex].map((text) => ({
      key: `${plans[planIndex].id}-${comparableText(text)}`,
      text,
      included: true,
    }));

  if (plans.length < 2) return featureLists.map((_, i) => ownRows(i));

  // The longest list; on a tie the later plan (usually the higher tier)
  const richestIndex = featureLists.reduce(
    (best, list, i) => (list.length >= featureLists[best].length ? i : best),
    0,
  );
  const richestList = featureLists[richestIndex];
  const richestKeys = richestList.map(comparableText);
  const isCumulative = featureLists.every((list) =>
    list.every((feature) => richestKeys.includes(comparableText(feature))),
  );

  if (!isCumulative) return featureLists.map((_, i) => ownRows(i));

  return featureLists.map((list, i) => {
    const ownTextByKey = new Map(
      list.map((feature) => [comparableText(feature), feature]),
    );
    return richestList.map((richestText, j) => {
      const ownText = ownTextByKey.get(richestKeys[j]);
      return {
        key: `${plans[i].id}-${richestKeys[j]}`,
        // Borrowed text from another record loses its stega (it would point at the wrong record)
        text: ownText ?? stripStega(richestText),
        included: ownText !== undefined,
      };
    });
  });
}

/** The highlighted plan: the middle one (1 → 0, 2 → 1, 3 → 1, 4 → 1, 5 → 2) */
export const featuredPlanIndex = (count: number) => {
  if (count <= 1) return 0;
  if (count === 2) return 1;
  return Math.floor((count - 1) / 2);
};

/** Plan tones deepen left to right: three plans give tone-1, tone-3 and tone-5 */
export const planTone = (index: number, count: number): Tone =>
  toneRamp(index, count, 1, 5);
