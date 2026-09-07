import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Age Calculator | Exact Chronological Age & Life Milestones',
  description: 'Calculate your exact age in years, months, and days. Find out how many total days you have been alive and track upcoming birthday milestones.',
  keywords: ['age calculator', 'chronological age', 'birthday calculator', 'how old am i', 'date of birth calculator'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
