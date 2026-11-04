import { Lock } from 'lucide-react';
import { type FormEvent, useEffect, useId, useRef, useState } from 'react';
import { uiString } from '@/lib/i18n/uiStrings';

type Props = {
  /** Lets the trigger point at the dialog with aria-controls */
  id?: string;
  locale: string;
  onCancel: () => void;
  /** Called once /api/draft/enable has accepted the password */
  onEnabled: () => void;
};

/**
 * The password prompt that turns Draft Mode on: the password is the
 * project's DRAFT_SECRET_TOKEN. A wrong one clears the field and shows an
 * error.
 */
const DraftPasswordPrompt = ({ id, locale, onCancel, onEnabled }: Props) => {
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const inputId = useId();
  const errorId = useId();
  // The environment variable's name goes where the hint has {variable}
  const [hintBefore, hintAfter] = uiString(locale, 'draftPasswordHint').split(
    '{variable}',
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function enableDraftMode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const response = await fetch(
        `/api/draft/enable?token=${encodeURIComponent(password)}`,
      );
      if (response.status === 200) {
        onEnabled();
        return;
      }
    } catch {
      // A failed request counts as a wrong password
    }
    setPassword('');
    setHasError(true);
  }

  return (
    <div
      id={id}
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="card p-6 shadow-pop max-md:p-5"
    >
      <span className="icon-tile">
        <Lock strokeWidth={1.75} aria-hidden="true" />
      </span>
      <h2 id={titleId} className="mt-4 text-h3 text-ink">
        {uiString(locale, 'authenticate')}
      </h2>
      <p id={descriptionId} className="mt-1 text-small text-ink-2">
        {hintBefore}
        <code className="rounded-md border border-line bg-well px-1 py-px font-mono text-[12px] text-ink">
          DRAFT_SECRET_TOKEN
        </code>
        {hintAfter}
      </p>

      <form className="mt-5" onSubmit={enableDraftMode}>
        <label htmlFor={inputId} className="field-label">
          {uiString(locale, 'password')}
        </label>
        <input
          ref={inputRef}
          id={inputId}
          type="password"
          autoComplete="off"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setHasError(false);
          }}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className="input"
        />
        <p
          id={errorId}
          aria-live="assertive"
          className="mt-2 text-small text-danger empty:mt-0"
        >
          {hasError ? uiString(locale, 'wrongPassword') : ''}
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            {uiString(locale, 'cancel')}
          </button>
          <button type="submit" className="btn btn-primary">
            {uiString(locale, 'authenticate')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DraftPasswordPrompt;
