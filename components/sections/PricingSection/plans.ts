import { stripStega } from '@datocms/content-link';
import { type Tone, toneRamp } from '@/utils/tones';

type PlanWithFeatures = { id: string; planFeatures?: string | null };

/** One line of a plan's feature list; `included: false` marks a feature only richer plans have */
export type FeatureRow = { key: string; text: string; included: boolean };

/** The visible text of a feature or limit, for matching it across plans */
export const comparableText = (text: string) =>
  stripStega(text).trim().toLowerCase();

/** planFeatures is a comma separated string in the CMS ("Email support, Commercial use") */
const splitFeatures = (planFeatures?: string | null) =>
  planFeatures
    ? planFeatures
        .split(/\s*,\s*/)
        .map((feature) => feature.trim())
        .filter(Boolean)
    : [];

/** A plan's own features, all included */
export const ownFeatureRows = (plan: PlanWithFeatures): FeatureRow[] =>
  splitFeatures(plan.planFeatures).map((text) => ({
    key: `${plan.id}-${comparableText(text)}`,
    text,
    included: true,
  }));

/**
 * One row list per plan. When every plan's features are a subset of the
 * richest plan (cumulative tiers, as in the demo content), each plan lists the
 * richest plan's features in its order, marking the ones it lacks as excluded,
 * so the lists line up across plans. Otherwise each plan lists only its own.
 */
export function planFeatureRows(plans: PlanWithFeatures[]): FeatureRow[][] {
  if (plans.length < 2) return plans.map(ownFeatureRows);

  const featureLists = plans.map((plan) => splitFeatures(plan.planFeatures));
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

  if (!isCumulative) return plans.map(ownFeatureRows);

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

/** Without a highlight label: the second of two plans, else the middle one */
const defaultHighlightIndex = (count: number) => {
  if (count <= 1) return 0;
  if (count === 2) return 1;
  return Math.floor((count - 1) / 2);
};

/** The highlighted plan: the first one with a highlight label in the CMS */
export const highlightedPlanIndex = (
  plans: { highlightLabel?: string | null }[],
) => {
  const labelled = plans.findIndex((plan) =>
    stripStega(plan.highlightLabel ?? '').trim(),
  );
  return labelled === -1 ? defaultHighlightIndex(plans.length) : labelled;
};

/** Plan tones deepen left to right: three plans give tone-1, tone-3 and tone-5 */
export const planTone = (index: number, count: number): Tone =>
  toneRamp(index, count, 1, 5);
