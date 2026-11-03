import { CircleCheck, X } from 'lucide-react';
import { uiString } from '@/lib/i18n/uiStrings';

type Props = {
  locale: string;
  onDismiss: () => void;
};

/** The confirmation shown once the password prompt has turned Draft Mode on */
const DraftModeEnabledToast = ({ locale, onDismiss }: Props) => {
  return (
    <div role="alert" className="card flex items-start gap-3 p-5 shadow-pop">
      <CircleCheck
        className="mt-px size-5 shrink-0 text-success"
        strokeWidth={1.75}
        aria-hidden="true"
      />

      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink">
          {uiString(locale, 'draftModeOn')}
        </p>
        <p className="mt-1 text-small text-ink-2">
          {uiString(locale, 'draftModeOnBody')}
        </p>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        aria-label={uiString(locale, 'dismiss')}
        className="btn btn-ghost btn-icon hit-44 -mt-1 -mr-1.5 size-8"
      >
        <X strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  );
};

export default DraftModeEnabledToast;
