import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Website Ad Revenue Calculator | Professional Earnings Estimator',
  description: 'Estimate your website ad revenue based on monthly pageviews, RPM, and ad density. Analyze traffic quality tiers to project annual income.',
  keywords: ['ad revenue calculator', 'website earnings estimator', 'RPM calculator', 'blog monetization', 'adsense earnings'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
