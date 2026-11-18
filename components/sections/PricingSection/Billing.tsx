'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useId,
  useState,
} from 'react';
import Segmented from '@/components/ui/Segmented';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';

export type BillingPeriod = 'monthly' | 'yearly';

type BillingContextValue = {
  period: BillingPeriod;
  setPeriod: (period: BillingPeriod) => void;
};

const BillingContext = createContext<BillingContextValue | null>(null);

/**
 * The billing period of one pricing section. Prices below it switch with CSS
 * only (`group-data-[period=yearly]/billing:`), so the server renders both
 * figures and monthly shows without JavaScript. The change is announced politely.
 */
export const BillingScope = ({
  locale,
  className,
  children,
}: {
  locale: string;
  className?: string;
  children: ReactNode;
}) => {
  const [period, setPeriodState] = useState<BillingPeriod>('monthly');
  const [announcement, setAnnouncement] = useState('');

  const setPeriod = (next: BillingPeriod) => {
    setPeriodState(next);
    setAnnouncement(
      uiString(
        locale,
        next === 'yearly' ? 'showingYearlyPrices' : 'showingMonthlyPrices',
      ),
    );
  };

  return (
    <BillingContext.Provider value={{ period, setPeriod }}>
      <div className={cn('group/billing', className)} data-period={period}>
        {children}
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>
      </div>
    </BillingContext.Provider>
  );
};

/** Monthly / yearly for the nearest BillingScope, drawn as the Segmented control */
export const BillingToggle = ({
  locale,
  className,
}: {
  locale: string;
  className?: string;
}) => {
  const billing = useContext(BillingContext);
  const name = useId();

  return (
    <Segmented
      legend={uiString(locale, 'billingPeriod')}
      name={name}
      value={billing?.period ?? 'monthly'}
      onChange={(next) => billing?.setPeriod(next)}
      options={[
        { value: 'monthly', label: uiString(locale, 'monthly') },
        { value: 'yearly', label: uiString(locale, 'yearly') },
      ]}
      className={className}
    />
  );
};
