'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';

export type BillingPeriod = 'monthly' | 'yearly';

type BillingPeriodContextValue = {
  period: BillingPeriod;
  setPeriod: (period: BillingPeriod) => void;
};

type Props = {
  children: ReactNode;
  locale: string;
  className?: string;
};

const BillingPeriodContext = createContext<BillingPeriodContextValue | null>(
  null,
);

/** The billing period of the nearest BillingPeriodProvider (null outside one) */
export const useBillingPeriod = () => useContext(BillingPeriodContext);

/**
 * Holds the billing period for one pricing section. Prices below it switch with
 * CSS only (group-data-[period=yearly]/billing:), so the server-rendered monthly
 * prices stay visible without JavaScript. The change is announced politely.
 */
const BillingPeriodProvider = ({ children, locale, className }: Props) => {
  const [period, setPeriodState] = useState<BillingPeriod>('monthly');
  const [announcement, setAnnouncement] = useState('');

  const setPeriod = useCallback(
    (next: BillingPeriod) => {
      setPeriodState(next);
      setAnnouncement(
        uiString(
          locale,
          next === 'yearly' ? 'showingYearlyPrices' : 'showingMonthlyPrices',
        ),
      );
    },
    [locale],
  );

  const value = useMemo(() => ({ period, setPeriod }), [period, setPeriod]);

  return (
    <BillingPeriodContext.Provider value={value}>
      <div className={cn('group/billing', className)} data-period={period}>
        {children}
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>
      </div>
    </BillingPeriodContext.Provider>
  );
};

export default BillingPeriodProvider;
