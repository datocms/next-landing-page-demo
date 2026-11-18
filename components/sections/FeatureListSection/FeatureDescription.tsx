import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { cn } from '@/utils/cn';
import {
  hasStructuredText,
  type StructuredTextField,
} from '@/utils/structuredText';

type Props = {
  description?: StructuredTextField | null;
  /** Placement and measure */
  className?: string;
};

/** A feature's description (Structured Text) in muted body text; nothing without one */
const FeatureDescription = ({ description, className }: Props) => {
  if (!hasStructuredText(description)) return null;

  return (
    <div className={cn('text-body text-fg-muted [&_p+p]:mt-2', className)}>
      <DatoStructuredText data={description} />
    </div>
  );
};

export default FeatureDescription;
