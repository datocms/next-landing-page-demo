import { cn } from '@/utils/cn';

type Props = {
  /** Colour, and a height to override the default */
  className?: string;
  /** Any CSS length: px for fixed bars, % for bars that follow their row */
  width: string;
};

/** A wordless skeleton bar standing in for a line of text in the product window */
const SkeletonBar = ({ className, width }: Props) => (
  <i
    className={cn('block h-2 flex-none rounded-full', className)}
    style={{ width }}
  />
);

export default SkeletonBar;
