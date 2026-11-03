export const MAX_RATING = 5;

/** The CMS rating as a whole number of stars, 0–5 */
export const clampRating = (rating?: number | null) =>
  typeof rating === 'number' && Number.isFinite(rating)
    ? Math.max(0, Math.min(MAX_RATING, Math.round(rating)))
    : 0;
