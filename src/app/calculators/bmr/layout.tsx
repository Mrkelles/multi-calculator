import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BMR Calculator | Basal Metabolic Rate Estimator',
  description: 'Calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation. Determine the calories your body burns at rest and plan your fitness goals.',
  keywords: ['bmr calculator', 'basal metabolic rate', 'calorie needs', 'metabolism estimator', 'TDEE calculator'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
