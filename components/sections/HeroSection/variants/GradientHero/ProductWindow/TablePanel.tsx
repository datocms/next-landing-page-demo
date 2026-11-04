import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import SkeletonBar from './SkeletonBar';

/** The table's rows: a tone dot, a name and a value of these widths */
const TABLE_ROWS = [
  { tone: 'tone-0', nameWidth: '30%', valueWidth: '16%' },
  { tone: 'tone-2', nameWidth: '38%', valueWidth: '12%' },
  { tone: 'tone-4', nameWidth: '24%', valueWidth: '18%' },
] as const;

/** A short table of checked rows */
const TablePanel = () => (
  <div
    aria-hidden="true"
    className="grid rounded-panel border border-line bg-white max-md:hidden"
  >
    {TABLE_ROWS.map((row, i) => (
      <div
        key={row.tone}
        className={cn(
          'flex h-10 items-center gap-3 px-3.5',
          i > 0 && 'border-line border-t',
        )}
      >
        <i className={cn('dot', row.tone)} />
        <SkeletonBar className="bg-sk-2" width={row.nameWidth} />
        <SkeletonBar className="ml-auto bg-sk" width={row.valueWidth} />
        <span className="grid size-4 flex-none place-items-center rounded-full bg-accent-solid text-white">
          <Check className="size-2.5" strokeWidth={3} />
        </span>
      </div>
    ))}
  </div>
);

export default TablePanel;
