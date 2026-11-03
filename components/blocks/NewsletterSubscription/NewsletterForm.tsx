'use client';

import { ArrowRight, CircleCheck } from 'lucide-react';
import { useParams } from 'next/navigation';
import { type FormEvent, useEffect, useId, useRef, useState } from 'react';
import { uiString } from '@/lib/i18n/uiStrings';

type Props = {
  buttonLabel?: string | null;
};

/**
 * Demo sign-up form: a pill capture (field plus inset primary button). There is
 * no newsletter endpoint, so nothing is sent: a valid address swaps the form for
 * an inline confirmation pill, announced by the live region. The input has no
 * name, so even a submit before hydration carries no address.
 */
const NewsletterForm = ({ buttonLabel }: Props) => {
  const { locale } = useParams<{ locale?: string }>();
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
    // From 768 the well's arch threads sit bottom-right: the row stops 200px
    // short of the content edge so the capture never touches a strand
    <div className="relative mt-5 w-full max-w-[440px] md:max-w-[min(440px,calc(100%-200px))]">
      {!subscribed && (
        <>
          <form
            noValidate
            onSubmit={subscribe}
            data-invalid={hasError || undefined}
            className="capture"
          >
            <label htmlFor={inputId} className="sr-only">
              {uiString(locale, 'emailAddress')}
            </label>
            <input
              ref={inputRef}
              id={inputId}
              type="email"
              autoComplete="email"
              required
              placeholder={uiString(locale, 'emailPlaceholder')}
              aria-invalid={hasError}
              aria-describedby={hasError ? errorId : undefined}
              onChange={() => setHasError(false)}
            />
            <button type="submit" className="btn btn-primary">
              {buttonLabel || uiString(locale, 'subscribe')}
              <ArrowRight
                strokeWidth={1.75}
                aria-hidden="true"
                className="btn-arrow rtl:rotate-180"
              />
            </button>
          </form>
          <p
            id={errorId}
            aria-live="assertive"
            className="mt-2 ps-[22px] text-small text-danger empty:hidden max-md:ps-[18px]"
          >
            {hasError ? uiString(locale, 'invalidEmail') : ''}
          </p>
        </>
      )}

      {/* Once subscribed, the region keeps the capture's height so the well does not jump */}
      <div
        aria-live="polite"
        className={
          subscribed
            ? 'flex min-h-13 items-center pointer-coarse:min-h-14'
            : undefined
        }
      >
        {subscribed && (
          <p
            ref={confirmationRef}
            tabIndex={-1}
            className="inline-flex min-h-7 items-center gap-2 rounded-full bg-white px-3 text-caption text-ink-2 shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--line)] outline-none"
          >
            <CircleCheck
              strokeWidth={1.75}
              aria-hidden="true"
              className="size-4 shrink-0 text-success"
            />
            {uiString(locale, 'subscribed')}
          </p>
        )}
      </div>
    </div>
  );
};

export default NewsletterForm;
