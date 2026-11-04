import { ArrowLeft, ArrowRight } from 'lucide-react';
import Segments from '@/components/ui/Ornaments/Segments';
import { twoDigits } from '@/utils/twoDigits';

type Props = {
  count: number;
  activeIndex: number;
  /** Id of the slides container, which the buttons control */
  slidesId: string;
  previousLabel: string;
  nextLabel: string;
  /** Called with -1 (previous) or 1 (next) */
  onStep: (delta: number) => void;
};

/** Previous and next buttons, then an "01 / 05" counter and the segment bar */
const SlideControls = ({
  count,
  activeIndex,
  slidesId,
  previousLabel,
  nextLabel,
  onStep,
}: Props) => (
  <div className="mt-auto flex items-center gap-2 pt-8 max-md:pt-7">
    <button
      type="button"
      onClick={() => onStep(-1)}
      aria-label={previousLabel}
      aria-controls={slidesId}
      className="btn btn-secondary btn-icon"
    >
      <ArrowLeft
        aria-hidden="true"
        strokeWidth={1.75}
        className="rtl:rotate-180"
      />
    </button>
    <button
      type="button"
      onClick={() => onStep(1)}
      aria-label={nextLabel}
      aria-controls={slidesId}
      className="btn btn-secondary btn-icon"
    >
      <ArrowRight
        aria-hidden="true"
        strokeWidth={1.75}
        className="rtl:rotate-180"
      />
    </button>
    <p aria-hidden="true" className="mono ms-3 whitespace-nowrap">
      {twoDigits(activeIndex + 1)} / {twoDigits(count)}
    </p>
    <Segments
      count={count}
      active={activeIndex}
      className="ms-3 max-lg:ms-auto"
    />
  </div>
);

export default SlideControls;
