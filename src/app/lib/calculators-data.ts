import {
  Home,
  TrendingUp,
  Briefcase,
  Percent,
  Calculator,
  DollarSign,
  BarChart,
  Youtube,
  User,
  Zap,
  LucideIcon
} from 'lucide-react';

export interface CalculatorInfo {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  path: string;
  category: 'finance' | 'health' | 'content';
}

export const calculators: CalculatorInfo[] = [
  {
    id: 'mortgage',
    name: 'Mortgage Calculator',
    description: 'Calculate monthly payments, interest, and payoff dates.',
    icon: Home,
    path: '/calculators/mortgage',
    category: 'finance',
  },
  {
    id: 'compound-interest',
    name: 'Compound Interest',
    description: 'Determine the future value of your investments over time.',
    icon: TrendingUp,
    path: '/calculators/compound-interest',
    category: 'finance',
  },
  {
    id: 'retirement',
    name: 'Retirement Planner',
    description: 'Estimate your nest egg and plan for a comfortable future.',
    icon: Briefcase,
    path: '/calculators/retirement',
    category: 'finance',
  },
  {
    id: 'tax',
    name: 'Tax Calculator',
    description: 'Estimated income tax based on specified rules and income.',
    icon: Percent,
    path: '/calculators/tax',
    category: 'finance',
  },
  {
    id: 'currency',
    name: 'Currency Converter',
    description: 'Quick conversion between global currencies with recent rates.',
    icon: DollarSign,
    path: '/calculators/currency',
    category: 'finance',
  },
  {
    id: 'loan-interest',
    name: 'Loan Interest',
    description: 'Calculate total interest and payment schedules for any loan.',
    icon: Calculator,
    path: '/calculators/loan-interest',
    category: 'finance',
  },
  {
    id: 'roi',
    name: 'ROI Calculator',
    description: 'Measure the profitability and gains of your investments.',
    icon: BarChart,
    path: '/calculators/roi',
    category: 'finance',
  },
  {
    id: 'youtube-revenue',
    name: 'YouTube Revenue',
    description: 'Estimate potential channel earnings based on views and CPM.',
    icon: Youtube,
    path: '/calculators/youtube-revenue',
    category: 'content',
  },
  {
    id: 'bmi',
    name: 'BMI Calculator',
    description: 'Calculate Body Mass Index to assess weight categories.',
    icon: User,
    path: '/calculators/bmi',
    category: 'health',
  },
  {
    id: 'calorie',
    name: 'Calorie Calculator',
    description: 'Estimate daily caloric needs based on activity and body metrics.',
    icon: Zap,
    path: '/calculators/calorie',
    category: 'health',
  },
];