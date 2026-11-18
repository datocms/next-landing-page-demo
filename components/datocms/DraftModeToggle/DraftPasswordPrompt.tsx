import { type FormEvent, useEffect, useId, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
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
      className="rounded-card border border-line bg-surface p-5 shadow-float"
    >
      <h2 id={titleId} className="text-h3">
        {uiString(locale, 'authenticate')}
      </h2>
      <p id={descriptionId} className="mt-1.5 text-small text-fg-muted">
        {hintBefore}
        <code className="rounded-[4px] bg-subtle px-1 py-px font-mono text-[0.8125rem] text-fg ring-1 ring-line ring-inset">
          DRAFT_SECRET_TOKEN
        </code>
        {hintAfter}
      </p>

      <form className="mt-5" onSubmit={enableDraftMode}>
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-small font-medium text-fg"
        >
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
          className="h-10 w-full rounded-control border border-line-strong bg-surface px-3 text-body text-fg shadow-card transition-colors duration-150 hover:border-fg-faint focus:border-accent-line aria-invalid:border-danger"
        />
        <p
          id={errorId}
          aria-live="assertive"
          className="mt-2 text-small text-danger empty:mt-0"
        >
          {hasError ? uiString(locale, 'wrongPassword') : ''}
        </p>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            {uiString(locale, 'cancel')}
          </Button>
          <Button type="submit" size="sm">
            {uiString(locale, 'authenticate')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DraftPasswordPrompt;
