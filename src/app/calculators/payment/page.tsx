"use client"

import { useState, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  CreditCard, 
  Table as TableIcon, 
  Info, 
  TrendingDown, 
  History, 
  Clock,
  ArrowRightLeft,
  Calculator,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Landmark
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component.
const metadata: Metadata = {
  title: 'Accurate Payment Calculator | Free Lending & Loan Calculator',
  description: 'Calculate monthly payments for any personal loan, auto loan, or mortgage instantly with our free payment calculator. Compare lending options and view full amortization schedules.',
  keywords: [
    'Payment Calculator',
    'lending calculator',
    'Car loan calulator',
    'MyApexCalc',
    'monthly payment estimator',
    'amortization calculator',
    'personal loan payment'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Interactive Loan & Lending Payment Calculator | MyApexCalc',
    description: 'Estimate your monthly installments in seconds. Run a quick loan or car loan calculation based on principal, interest rate, and term length.',
    url: 'https://www.myapexcalc.com/calculators/payment',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/Wvx4RW1T/payment-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Interactive Payment and Amortization Calculator Dashboard',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Free Monthly Payment & Amortization Calculator | MyApexCalc',
    description: 'Instantly figure out monthly payments, total interest fees, and payoff timelines for any loan structure.',
    images: ['https://i.ibb.co/Wvx4RW1T/payment-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/payment',
  },
};

export default function PaymentCalculatorPage() {
  // Mode: Fixed Term (Calculate Payment) vs Fixed Payment (Calculate Term)
  const [calcMode, setCalcMode] = useState<'fixed-term' | 'fixed-payment'>('fixed-term');

  // Common Inputs
  const [loanAmount, setLoanAmount] = useState(25000);
  const [interestRate, setInterestRate] = useState(7.5);

  // Mode Specific Inputs
  const [termMonths, setTermMonths] = useState(60); // for Fixed Term
  const [monthlyPaymentInput, setMonthlyPaymentInput] = useState(500); // for Fixed Payment

  const results = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 100 / 12;
    
    let monthlyPayment = 0;
    let totalMonths = 0;
    let totalInterest = 0;
    let totalCost = 0;
    const monthlySchedule = [];
    const yearlySchedule = [];

    if (calcMode === 'fixed-term') {
      totalMonths = termMonths;
      if (r === 0) {
        monthlyPayment = P / totalMonths;
      } else {
        monthlyPayment = (P * r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1);
      }
    } else {
      // Fixed Payment Mode: Calculate n (months)
      // n = -log(1 - (r * P) / PMT) / log(1 + r)
      monthlyPayment = monthlyPaymentInput;
      if (monthlyPayment <= P * r) {
        return { error: "Payment is too low to cover monthly interest." };
      }
      
      if (r === 0) {
        totalMonths = Math.ceil(P / monthlyPayment);
      } else {
        const n = -Math.log(1 - (r * P) / monthlyPayment) / Math.log(1 + r);
        totalMonths = Math.ceil(n);
      }
    }

    // Amortization Generation
    let remainingBalance = P;
    let totalIntAcc = 0;
    let totalPrincAcc = 0;

    for (let m = 1; m <= totalMonths; m++) {
      const interestForMonth = remainingBalance * r;
      let principalForMonth = monthlyPayment - interestForMonth;

      // Handle the last payment
      if (remainingBalance < principalForMonth) {
        principalForMonth = remainingBalance;
      }

      const actualPayment = principalForMonth + interestForMonth;
      remainingBalance -= principalForMonth;
      totalIntAcc += interestForMonth;
      totalPrincAcc += principalForMonth;

      monthlySchedule.push({
        period: m,
        payment: actualPayment,
        principal: principalForMonth,
        interest: interestForMonth,
        totalInterest: totalIntAcc,
        balance: Math.max(0, remainingBalance)
      });

      // Yearly Aggregation
      if (m % 12 === 0 || m === totalMonths) {
        const year = Math.ceil(m / 12);
        const last12 = monthlySchedule.slice(-12);
        const yearInt = last12.reduce((s, i) => s + i.interest, 0);
        const yearPrinc = last12.reduce((s, i) => s + i.principal, 0);
        const yearPay = last12.reduce((s, i) => s + i.payment, 0);

        // Only push if it's a full year or the very end
        if (m % 12 === 0 || m === totalMonths) {
          yearlySchedule.push({
            period: year,
            payment: yearPay,
            principal: yearPrinc,
            interest: yearInt,
            totalInterest: totalIntAcc,
            balance: Math.max(0, remainingBalance)
          });
        }
      }
    }

    totalCost = P + totalIntAcc;
    totalInterest = totalIntAcc;

    return { 
      monthlyPayment, 
      totalMonths, 
      totalInterest, 
      totalCost, 
      monthlySchedule, 
      yearlySchedule 
    };
  }, [calcMode, loanAmount, interestRate, termMonths, monthlyPaymentInput]);

  return (
    <CalculatorWrapper
      title="Payment Calculator"
      description="Plan your finances by calculating exact monthly payments or determining how long it will take to pay off a loan."
      icon={CreditCard}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <Tabs value={calcMode} onValueChange={(v: any) => setCalcMode(v)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="fixed-term">Fixed Term</TabsTrigger>
                  <TabsTrigger value="fixed-payment">Fixed Payment</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Loan Amount ($)</Label>
                <Input 
                  type="number" 
                  value={loanAmount} 
                  onChange={(e) => setLoanAmount(Number(e.target.value))} 
                />
              </div>

              <div className="space-y-2">
                <Label>Annual Interest Rate (%)</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  value={interestRate} 
                  onChange={(e) => setInterestRate(Number(e.target.value))} 
                />
              </div>

              {calcMode === 'fixed-term' ? (
                <div className="space-y-2">
                  <Label>Loan Term (Months)</Label>
                  <Input 
                    type="number" 
                    value={termMonths} 
                    onChange={(e) => setTermMonths(Number(e.target.value))} 
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Monthly Payment ($)</Label>
                  <Input 
                    type="number" 
                    value={monthlyPaymentInput} 
                    onChange={(e) => setMonthlyPaymentInput(Number(e.target.value))} 
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                Quick Tip
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              {calcMode === 'fixed-term' 
                ? "Use this mode to find out how much your monthly bill will be for a set period."
                : "Use this mode to see how fast you can pay off a loan if you have a specific budget in mind."}
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7 space-y-6">
          {results.error ? (
            <Card className="bg-destructive/10 border-destructive/20">
              <CardContent className="py-10 text-center text-destructive font-bold">
                {results.error}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-primary text-white border-none shadow-lg">
                  <CardContent className="pt-6">
                    <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1 font-bold">
                      {calcMode === 'fixed-term' ? 'Monthly Payment' : 'Total Months'}
                    </p>
                    <h3 className="text-3xl font-bold font-headline">
                      {calcMode === 'fixed-term' 
                        ? `$${results.monthlyPayment?.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                        : results.totalMonths}
                    </h3>
                  </CardContent>
                </Card>
                <Card className="bg-accent text-white border-none shadow-lg">
                  <CardContent className="pt-6">
                    <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1 font-bold">Total Interest</p>
                    <h3 className="text-3xl font-bold font-headline">
                      ${results.totalInterest?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </h3>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TableIcon className="w-5 h-5 text-primary" />
                    Amortization Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="yearly">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="yearly">Yearly</TabsTrigger>
                      <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="yearly">
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader className="bg-muted/50">
                            <TableRow>
                              <TableHead>Year</TableHead>
                              <TableHead>Principal</TableHead>
                              <TableHead>Interest</TableHead>
                              <TableHead className="text-right">Balance</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {results.yearlySchedule?.map((row) => (
                              <TableRow key={row.period}>
                                <TableCell className="font-medium">{row.period}</TableCell>
                                <TableCell>${row.principal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                                <TableCell>${row.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                                <TableCell className="text-right font-bold">${row.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>

                    <TabsContent value="monthly">
                      <div className="rounded-md border overflow-hidden max-h-[400px] overflow-y-auto">
                        <Table>
                          <TableHeader className="bg-muted/50 sticky top-0 z-10">
                            <TableRow>
                              <TableHead>Month</TableHead>
                              <TableHead>Principal</TableHead>
                              <TableHead>Interest</TableHead>
                              <TableHead className="text-right">Balance</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {results.monthlySchedule?.slice(0, 120).map((row) => (
                              <TableRow key={row.period}>
                                <TableCell className="font-medium">{row.period}</TableCell>
                                <TableCell>${row.principal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                                <TableCell>${row.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                                <TableCell className="text-right font-bold">${row.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Informational Text Section */}
        <div className="lg:col-span-12 py-10 space-y-12">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Master Your Financing Options with MyApexCalc
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Whether you are consolidating high-interest credit card debt, shopping for a new vehicle, or funding a major home improvement project, taking out a loan requires a clear understanding of your long-term commitments. Focusing strictly on whether a monthly bill fits your current budget can lead to costly mistakes—such as paying thousands of extra dollars in unnecessary interest over extended terms. Our free, comprehensive Payment Calculator is engineered to bring total transparency to your borrowing decisions, giving you a powerful, live lending calculator to compare options side-by-side.
              </p>
              
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
                <Calculator className="w-6 h-6" />
                The Amortization Formula: How Monthly Payments are Derived
              </h3>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Whenever you take out a fixed-rate installment loan, your lender uses standard financial mathematical models to ensure the loan is completely paid off to a zero balance by the end of your term. Whether you are using this as a personal loan tool or a Car loan calulator, the mathematical calculation behind your monthly installment (PMT) is calculated using the standard amortization formula:
                </p>
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                  PMT = P × [ r(1+r)<sup>n</sup> ] / [ (1+r)<sup>n</sup> - 1 ]
                </div>
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">P</span> represents your total starting loan principal (the borrowed amount).</p>
                  <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">r</span> represents your monthly interest rate (calculated by taking your annual interest rate/APR and dividing it by 12 months).</p>
                  <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">n</span> represents the total number of monthly payments required by the loan term (for example, a 3-year term equals 36 payments).</p>
                </div>
                <p className="text-muted-foreground leading-relaxed pt-2">
                  As you make payments over time, the percentage of your money going toward the interest decreases, while the portion going directly toward paying down your principal balance increases. This shifting balance is plotted on your amortization schedule, which our tool generates dynamically.
                </p>
              </div>
            </section>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Info className="w-5 h-5 text-accent" />
                  Key Factors to Consider Before You Borrow
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Using our payment dashboard helps you look beyond the basic monthly numbers to find the most cost-effective path forward:
                </p>
                <ul className="space-y-6 pt-2">
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Landmark className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">The Real Cost of Interest</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Even a minor 1% or 2% difference in your annual percentage rate (APR) can result in hundreds of dollars saved or lost over the life of a typical 60-month loan.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                      <Clock className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Term Length Trade-offs</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Shortening your loan term (e.g., choosing 36 months instead of 60 months) will increase your required monthly payment, but it drastically slashes the total interest you pay to the bank.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Hidden Fees and Penalties</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Always check if your personal or auto loan includes origination fees or prepayment penalties, which can alter your true out-of-pocket costs.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                <h4 className="text-xl font-bold text-primary">Calculation Types</h4>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                      <ArrowRightLeft className="h-3 w-3 text-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Fixed Term Calculation</p>
                      <p className="text-xs text-muted-foreground">Standard for mortgages and car loans. You decide the duration (e.g., 5 years), and we calculate the payment required to reach zero by then.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Fixed Payment Calculation</p>
                      <p className="text-xs text-muted-foreground">Standard for aggressive debt payoff. You decide your monthly budget, and we calculate how many months it will take to be debt-free.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 space-y-6">
                <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Why Estimate Your Payments with MyApexCalc?
                </h4>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                    <span><strong>All-in-One Loan Modeling:</strong> Calculate payments for personal loans, auto loans, or household lines of credit on a single page.</span>
                  </li>
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                    <span><strong>Instant Dynamic Sliders:</strong> Effortlessly slide your principal amounts, interest rates, and loan terms to watch your total costs recalculate in real-time.</span>
                  </li>
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                    <span><strong>Full Amortization Visualizations:</strong> Access an interactive, year-by-year table highlighting your remaining loan balances and lifetime interest paid.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
