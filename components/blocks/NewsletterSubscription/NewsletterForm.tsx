'use client';

import { type FormEvent, useEffect, useId, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import { CheckIcon } from '@/components/ui/icons';

/** Interface copy, resolved on the server for the page's locale */
type NewsletterFormLabels = {
  emailAddress: string;
  emailPlaceholder: string;
  /** The button's label when the block sets none */
  subscribe: string;
  invalidEmail: string;
  subscribed: string;
};

type Props = {
  buttonLabel?: string | null;
  labels: NewsletterFormLabels;
};

/**
 * Demo sign-up form: a labelled email field and a submit button. There is no
 * newsletter endpoint, so nothing is sent: a valid address swaps the form for
 * an inline confirmation, announced by the live region and focused so the
 * keyboard does not lose its place. The input has no name, so even a submit
 * before hydration carries no address.
 */
const NewsletterForm = ({ buttonLabel, labels }: Props) => {
  const id = useId();
  const inputId = `${id}-email`;
  const errorId = `${id}-error`;
  const inputRef = useRef<HTMLInputElement>(null);
  const confirmationRef = useRef<HTMLParagraphElement>(null);
  const [hasError, setHasError] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // The submit button disappears with the form: keep keyboard focus in place
  useEffect(() => {
    if (subscribed) confirmationRef.current?.focus();
  }, [subscribed]);

  const subscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = inputRef.current;
    if (!input) return;

    if (!input.value.trim() || !input.checkValidity()) {
      setHasError(true);
      input.focus();
      return;
    }

    setSubscribed(true);
  };

  return (
    <div className="mt-6">
      {!subscribed && (
        <form noValidate onSubmit={subscribe} className="max-w-[28rem]">
          <label htmlFor={inputId} className="sr-only">
            {labels.emailAddress}
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <input
              ref={inputRef}
              id={inputId}
              type="email"
              autoComplete="email"
              required
              placeholder={labels.emailPlaceholder}
              aria-invalid={hasError}
              aria-describedby={hasError ? errorId : undefined}
              onChange={() => setHasError(false)}
              className="h-11 w-full min-w-0 rounded-control border border-line bg-surface px-4 text-body transition-colors duration-150 placeholder:text-fg-faint hover:border-line-strong focus:border-accent aria-invalid:border-danger sm:flex-1"
            />
            <Button type="submit">{buttonLabel || labels.subscribe}</Button>
          </div>
          <p
            id={errorId}
            aria-live="assertive"
            className="mt-2 text-small text-danger empty:hidden"
          >
            {hasError ? labels.invalidEmail : ''}
          </p>
        </form>
      )}

      {/* Present from the start, so the confirmation is announced when it appears */}
      <div aria-live="polite">
        {subscribed && (
          <p
            ref={confirmationRef}
            tabIndex={-1}
            className="flex items-center gap-2 text-body font-medium outline-none"
          >
            <CheckIcon className="size-4 shrink-0 text-success" />
            {labels.subscribed}
          </p>
        )}
      </div>
    </div>
  );
};

export default NewsletterForm;
