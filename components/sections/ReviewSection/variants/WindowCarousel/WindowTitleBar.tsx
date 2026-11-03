import { SlideCounter } from '@/components/sections/ReviewSection/CarouselControls';

type Props = {
  index: number;
  count: number;
};

/** The review window's title bar: three dots, a blank address pill and, with several reviews, the counter */
const WindowTitleBar = ({ index, count }: Props) => (
  <div aria-hidden="true" className="window-bar relative h-9 max-md:h-8">
    <span className="window-dots">
      <i />
      <i />
      <i />
    </span>
    <span className="absolute top-1/2 left-1/2 flex h-[18px] w-[200px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-surface max-md:w-[132px]">
      <i className="block h-1.5 w-24 rounded-full bg-sk-2 max-md:w-16" />
    </span>
    {count > 1 && (
      <SlideCounter index={index} count={count} className="ms-auto" />
    )}
  </div>
);

export default WindowTitleBar;
