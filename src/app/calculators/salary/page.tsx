"use client"

import { useState, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Wallet, 
  Info, 
  Clock, 
  Calendar, 
  Briefcase, 
  History, 
  DollarSign,
  TrendingUp,
  ChevronRight,
  Calculator,
  ShieldCheck
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component.
const metadata: Metadata = {
  title: 'Accurate Salary Calculator | Free Wage & Paycheck Estimator',
  description: 'Convert your annual salary to hourly, weekly, bi-weekly, or monthly pay instantly. Use our free salary calculator to estimate your paycheck earnings.',
  keywords: [
    'Salary Calculator',
    'pay check calculator',
    'pay calculator',
    'wage calculator',
    'MyApexCalc',
    'hourly to salary converter',
    'income breakdown tool'
  ],
  
  // Open Graph for social sharing platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Salary & Paycheck Calculator | MyApexCalc',
    description: 'Convert and break down your earnings instantly. Easily calculate hourly wages, monthly income, and annual salary values with our free tool.',
    url: 'https://www.myapexcalc.com/calculators/salary',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/6cNntKby/salary-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Salary and Paycheck Conversion Calculator Interface',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Free Wage & Paycheck Estimator | MyApexCalc',
    description: 'Quickly calculate annual, monthly, bi-weekly, and hourly income breakdowns online.',
    images: ['https://i.ibb.co/6cNntKby/salary-calculator.png'],
  },

  // Prevent duplicate index penalties by setting a clean canonical pathway
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/salary',
  },
};

type SalaryPeriod = 'year' | 'quarter' | 'month' | 'biweek' | 'week' | 'day' | 'hour';

export default function SalaryCalculatorPage() {
  const [amount, setAmount] = useState(50000);
  const [period, setPeriod] = useState<SalaryPeriod>('year');
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [holidays, setHolidays] = useState(10);
  const [vacationDays, setVacationDays] = useState(15);

  const results = useMemo(() => {
    // 1. Calculate Base Yearly (Unadjusted)
    let yearlyBase = 0;
    switch (period) {
      case 'year': yearlyBase = amount; break;
      case 'quarter': yearlyBase = amount * 4; break;
      case 'month': yearlyBase = amount * 12; break;
      case 'biweek': yearlyBase = amount * 26; break;
      case 'week': yearlyBase = amount * 52; break;
      case 'day': yearlyBase = amount * daysPerWeek * 52; break;
      case 'hour': yearlyBase = amount * hoursPerWeek * 52; break;
    }

    // Calculations
    const hoursPerDay = hoursPerWeek / daysPerWeek;
    const totalWorkingDaysPerYear = 52 * daysPerWeek;
    const actualWorkingDaysPerYear = totalWorkingDaysPerYear - holidays - vacationDays;
    
    // Period Breakdowns
    const breakdowns = [
      { label: 'Year', value: yearlyBase },
      { label: 'Quarter', value: yearlyBase / 4 },
      { label: 'Month', value: yearlyBase / 12 },
      { label: 'Bi-Week', value: yearlyBase / 26 },
      { label: 'Week', value: yearlyBase / 52 },
      { label: 'Day', value: yearlyBase / totalWorkingDaysPerYear },
      { label: 'Hour', value: yearlyBase / (52 * hoursPerWeek) },
    ];

    return { breakdowns, actualWorkingDaysPerYear, hoursPerDay };
  }, [amount, period, hoursPerWeek, daysPerWeek, holidays, vacationDays]);

  return (
    <CalculatorWrapper
      title="Salary Calculator"
      description="Convert your pay between hourly, weekly, monthly, and yearly periods while adjusting for your specific work schedule."
      icon={Wallet}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Salary Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Salary Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input 
                      type="number" 
                      className="pl-7" 
                      value={amount} 
                      onChange={(e) => setAmount(Number(e.target.value))} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Per Period</Label>
                  <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="year">Year</SelectItem>
                      <SelectItem value="quarter">Quarter</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="biweek">Bi-Week</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="hour">Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Hours / Week</Label>
                  <Input 
                    type="number" 
                    value={hoursPerWeek} 
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Days / Week</Label>
                  <Input 
                    type="number" 
                    value={daysPerWeek} 
                    onChange={(e) => setDaysPerWeek(Number(e.target.value))} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Holidays / Year</Label>
                  <Input 
                    type="number" 
                    value={holidays} 
                    onChange={(e) => setHolidays(Number(e.target.value))} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Vacation / Year</Label>
                  <Input 
                    type="number" 
                    value={vacationDays} 
                    onChange={(e) => setVacationDays(Number(e.target.value))} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Work Year Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2 text-muted-foreground">
              <div className="flex justify-between border-b pb-1.5">
                <span>Total Work Days</span>
                <span className="font-bold text-foreground">{260}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span>Actual Working Days</span>
                <span className="font-bold text-foreground">{results.actualWorkingDaysPerYear}</span>
              </div>
              <div className="flex justify-between">
                <span>Hours per Day</span>
                <span className="font-bold text-foreground">{results.hoursPerDay.toFixed(1)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results Table */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="bg-primary text-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Salary Conversion Table
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold">Time Period</TableHead>
                    <TableHead className="text-right font-bold">Unadjusted Salary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.breakdowns.map((row) => (
                    <TableRow key={row.label} className={row.label.toLowerCase() === period ? "bg-primary/5" : ""}>
                      <TableCell className="font-medium py-4">{row.label}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-lg">
                        ${row.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4">
            <Info className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-blue-800 font-bold">Important Note on Taxes</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                These calculations represent <strong>Gross Salary</strong> before any deductions. Your actual take-home pay will be lower after federal, state, and FICA taxes are withheld. Use our <a href="/calculators/tax" className="underline font-bold">Tax Calculator</a> for a more accurate net pay estimate.
              </p>
            </div>
          </div>
        </div>

        {/* Informational Text Section */}
        <div className="lg:col-span-12 py-10 space-y-12">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Take Charge of Your Earnings with MyApexCalc
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Whether you are interviewing for a new job, negotiating a raise, comparing freelance contracts, or planning your household budget, having a clear grasp of your exact income breakdown is essential. While job listings usually show an annual salary, daily life is budgeted by the week, month, or paycheck. Our free, intuitive Salary Calculator takes the complexity out of personal finance, serving as a comprehensive pay calculator and dynamic wage calculator to map your earnings instantly.
              </p>
              <p className="text-xs text-muted-foreground italic bg-muted/30 p-3 rounded-lg border border-dashed">
                "Understanding Your Gross Earnings vs. Estimated Deductions. Source: The Salary Calculator"
              </p>
              
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
                <Calculator className="w-6 h-6" />
                How to Convert Annual Salary to Paycheck Realities
              </h3>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Converting your total annual salary into different pay frequencies requires standard mathematical models. When you use our pay check calculator, the conversion engine operates on the standard US work year structure, which assumes a baseline of 52 weeks or 2,080 working hours per year (40 hours per week):
                </p>

                <div className="space-y-2">
                  <p className="font-bold text-sm text-foreground">1. Calculating Your Hourly Wage</p>
                  <p className="text-sm text-muted-foreground">To find your base hourly rate from your overall annual salary, the formula divides your total earnings by the standard yearly work hours:</p>
                  <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                    Hourly Wage = Annual Salary / 2,080 Hours
                  </div>
                  <p className="text-xs text-muted-foreground pt-1">
                    Using this standard baseline, an annual salary of $60,000 translates to an equivalent hourly rate of approximately $28.85.
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="font-bold text-sm text-foreground">2. Calculating Your Paycheck Earnings</p>
                  <p className="text-sm text-muted-foreground">Depending on how often your employer processes payroll, your pre-tax gross paycheck amounts are calculated by dividing your annual salary by the corresponding pay periods:</p>
                  
                  <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="font-bold text-[10px] uppercase">Pay Frequency</TableHead>
                          <TableHead className="font-bold text-[10px] uppercase">Pay Periods / Year</TableHead>
                          <TableHead className="text-right font-bold text-[10px] uppercase">Formula</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-xs font-medium">Monthly</TableCell>
                          <TableCell className="text-xs">12</TableCell>
                          <TableCell className="text-right text-[10px] font-mono">Gross Pay = Salary / 12</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-xs font-medium">Semi-Monthly</TableCell>
                          <TableCell className="text-xs">24</TableCell>
                          <TableCell className="text-right text-[10px] font-mono">Gross Pay = Salary / 24</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-xs font-medium">Bi-Weekly</TableCell>
                          <TableCell className="text-xs">26</TableCell>
                          <TableCell className="text-right text-[10px] font-mono">Gross Pay = Salary / 26</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-xs font-medium">Weekly</TableCell>
                          <TableCell className="text-xs">52</TableCell>
                          <TableCell className="text-right text-[10px] font-mono">Gross Pay = Salary / 52</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                    <strong>Note:</strong> While bi-weekly and semi-monthly setups seem similar, they yield different paycheck amounts because bi-weekly schedules include two "three-paycheck months" during the year.
                  </p>
                </div>
              </div>
            </section>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Info className="w-5 h-5 text-accent" />
                  Why Map Your Income with MyApexCalc?
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Instead of manually punching numbers on a basic phone calculator or guessing your weekly earnings, MyApexCalc provides:
                </p>
                <ul className="space-y-6 pt-2">
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <History className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">All-in-One Multi-Frequency Table</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Input a single value—whether it is an hourly wage or an annual salary—and watch our calculator instantly populate your equivalent daily, weekly, bi-weekly, monthly, and yearly rates.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                      <ChevronRight className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Flexible Work Week Parameters</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Tailor your results by adjusting your average working hours per day and working days per week to match your actual job schedule.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Clear, Fast, and Private</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Analyze different payment structures and job offers privately, with zero sign-up walls or personal details required.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4">
                <History className="w-10 h-10 text-primary opacity-40 shrink-0" />
                <p className="text-[10px] text-muted-foreground leading-tight italic">
                  "Your time is your currency. Measure its value with absolute precision to ensure your career goals align with your lifestyle needs."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
