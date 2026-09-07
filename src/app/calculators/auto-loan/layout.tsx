import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Auto Loan Calculator | Monthly Car Payment Estimator',
  description: 'Calculate your monthly car payment including trade-ins, sales tax, and fees. Compare loan terms and interest rates for the best vehicle financing deal.',
  keywords: ['auto loan calculator', 'car payment estimator', 'vehicle financing', 'trade-in value', 'loan interest calculator'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
