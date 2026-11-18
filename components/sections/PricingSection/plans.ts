import { stripStega } from '@datocms/content-link';
import {
  ancestorEditUrl,
  fieldEditUrl,
  siblingEditUrl,
} from '@/lib/datocms/contentLink';

type PlanWithFeatures = {
  id: string;
  name?: string;
  features: { label: string }[];
};

/**
 * One line of a plan's feature list; `included: false` marks a feature only
 * richer plans have. `editUrl` is its Content Link target in Draft Mode: the
 * feature's label, or for a missing feature the plan's feature list.
 */
export type FeatureRow = {
  key: string;
  text: string;
  included: boolean;
  editUrl?: string;
};

/** Where a feature the plan lacks is added: its feature list, else the plan */
const featureListEditUrl = (plan: PlanWithFeatures) =>
  ancestorEditUrl(plan.features[0]?.label, 2) ?? fieldEditUrl(plan.name);

/** The visible text of a feature or limit, for matching it across plans */
export const comparableText = (text: string) =>
  stripStega(text).trim().toLowerCase();

/** A plan's features: one Plan feature block each in the CMS */
const featureLabels = (plan: PlanWithFeatures) =>
  plan.features
    .map((feature) => feature.label)
    // In Draft Mode an empty label can still carry Content Link markers
    .filter((label) => stripStega(label).trim());

/** A plan's own features, all included */
export const ownFeatureRows = (plan: PlanWithFeatures): FeatureRow[] =>
  featureLabels(plan).map((text) => ({
    key: `${plan.id}-${comparableText(text)}`,
    text,
    included: true,
    editUrl: siblingEditUrl(text, 'label'),
  }));

/**
 * One row list per plan. When every plan's features are a subset of the
 * richest plan (cumulative tiers, as in the demo content), each plan lists the
 * richest plan's features in its order, marking the ones it lacks as excluded,
 * so the lists line up across plans. Otherwise each plan lists only its own.
 */
export function planFeatureRows(plans: PlanWithFeatures[]): FeatureRow[][] {
  if (plans.length < 2) return plans.map(ownFeatureRows);

  const featureLists = plans.map(featureLabels);
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
        editUrl:
          ownText !== undefined
            ? siblingEditUrl(ownText, 'label')
            : featureListEditUrl(plans[i]),
      };
    });
  });
}

/** The highlighted plan: the first one with a highlight label in the CMS, or -1 when none has one */
export const highlightedPlanIndex = (
  plans: { highlightLabel?: string | null }[],
) => plans.findIndex((plan) => stripStega(plan.highlightLabel ?? '').trim());

/** "$399" in the page's number format ("399 $" in German); fractions keep two decimals */
export const formatPrice = (amount: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
