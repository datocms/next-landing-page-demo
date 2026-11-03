import { uiString } from '@/lib/i18n/uiStrings';
import { MAX_RATING } from './rating';

type Props = {
  /** Whole stars, from clampRating */
  value: number;
  locale: string;
};

/** What screen readers hear in place of the visual rating. Nothing for 0 */
const SpokenRating = ({ value, locale }: Props) =>
  value > 0 ? (
    <span className="sr-only">
      {uiString(locale, 'ratedOutOf', { value, max: MAX_RATING })}
    </span>
  ) : null;

export default SpokenRating;
