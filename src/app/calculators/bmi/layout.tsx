import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BMI Calculator | Accurate Body Mass Index & Health Status',
  description: 'Quickly calculate your Body Mass Index (BMI) using metric or imperial units. Compare your results against official WHO health categories.',
  keywords: ['bmi calculator', 'body mass index', 'weight status', 'health calculator', 'ideal weight estimator'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
