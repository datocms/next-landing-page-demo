import { CheckIcon, CloseIcon } from '@/components/ui/icons';
import { uiString } from '@/lib/i18n/uiStrings';

type Props = {
  locale: string;
  onDismiss: () => void;
};

/** The confirmation shown once the password prompt has turned Draft Mode on */
const DraftModeEnabledToast = ({ locale, onDismiss }: Props) => {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-card border border-line bg-surface p-4 shadow-float"
    >
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-small font-medium text-fg">
          <CheckIcon className="size-4 shrink-0 text-success" />
          {uiString(locale, 'draftModeOn')}
        </p>
        <p className="mt-1 pl-6 text-small text-fg-muted">
          {uiString(locale, 'draftModeOnBody')}
        </p>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        aria-label={uiString(locale, 'dismiss')}
        className="hit-44 -mt-1 -mr-1 grid size-7 shrink-0 place-items-center rounded-[6px] text-fg-muted transition-colors duration-150 hover:bg-subtle hover:text-fg"
      >
        <CloseIcon className="size-3.5" />
      </button>
    </div>
  );
};

export default DraftModeEnabledToast;
