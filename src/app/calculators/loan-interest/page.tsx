"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Calculator, 
  TrendingUp, 
  Info, 
  History, 
  BarChart, 
  ShieldCheck, 
  ChevronRight,
  Landmark,
  Lightbulb
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loan Interest Calculator | Total Cost of Borrowing',
  description: 'Calculate the total interest paid on personal or auto loans. View monthly payments and principal payoff structures.',
  keywords: ['loan interest calculator', 'borrowing cost', 'auto loan interest', 'personal loan calculator', 'interest payment estimator'],
};

export default function LoanInterestPage() {
  const [loanAmount, setLoanAmount] = useState(25000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTerm, setLoanTerm] = useState(60); // Months

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    const r = interestRate / 100 / 12;
    const n = loanTerm;
    const p = loanAmount;

    if (r === 0) {
      setMonthlyPayment(p / n);
      setTotalInterest(0);
      return;
    }

    const payment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setMonthlyPayment(payment);
    setTotalInterest((payment * n) - p);
  }, [loanAmount, interestRate, loanTerm]);

  return (
    <CalculatorWrapper
      title="Loan Interest Calculator"
      description="Easily calculate the true cost of borrowing money for personal loans or auto loans."
      icon={Calculator}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Loan Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Loan Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">Annual Interest Rate (%)</Label>
              <Input
                id="rate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="term">Loan Term (Months)</Label>
              <Input
                id="term"
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary text-white">
            <CardHeader className="pb-0 pt-8 text-center">
              <CardTitle className="text-xs uppercase tracking-widest opacity-80">Monthly Payment</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <div className="text-6xl font-bold font-headline">
                ${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loan Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Total Interest Paid</span>
                <span className="font-bold text-accent">${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Total Cost of Loan</span>
                <span className="font-semibold">${(loanAmount + totalInterest).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Payment scheduled for {loanTerm} monthly installments at {interestRate}% APR.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Informational Text Section */}
      <div className="py-10 space-y-12">
        <Separator />

        {/* Worked Examples Section */}
        <section className="space-y-6 text-left">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-xl text-accent"><Lightbulb size={24} /></div>
            <h3 className="text-2xl font-bold text-primary">Worked Examples</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">Scenario 1: Short vs. Long Term</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>A borrower takes a <strong>$15,000 personal loan</strong> at <strong>10% interest</strong>. Loan A is for <strong>3 years</strong>; Loan B is for <strong>5 years</strong>.</p>
                <p>Loan A has a payment of <strong>$484.01/mo</strong> and costs <strong>$2,424</strong> in interest. Loan B has a lower payment of <strong>$318.71/mo</strong> but costs <strong>$4,122</strong> in interest—nearly $1,700 more for the same principal.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">Scenario 2: The Impact of Credit Score</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Comparing two <strong>$30,000 auto loans</strong> over <strong>60 months</strong>. Applicant A gets a <strong>5% rate</strong>; Applicant B (with lower credit) gets <strong>12%</strong>.</p>
                <p>Applicant A pays <strong>$566.14/mo</strong> and <strong>$3,968 total interest</strong>. Applicant B pays <strong>$667.33/mo</strong> and <strong>$10,040 total interest</strong>. Improving your rate by 7% saves <strong>$6,072</strong> over five years.</p>
              </CardContent>
            </div>
          </section>

        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Take Control of Your Borrowing with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Whether you are managing a personal loan, financing a vehicle, or refinancing student debt, understanding the true cost of borrowing is essential for keeping your finances in order. While many people focus only on their monthly payment, the long-term cost is driven entirely by how interest builds over time. Our free online loan interest tool simplifies these numbers, giving you an immediate breakdown of your interest payments and principal payoff structures.
            </p>
            
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              Interest Accrual: Loans vs. Compound Investments
            </h3>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                When you save money in a high-yield account, you want to use a compound interest calculator to project how your wealth accelerates. In that scenario, compound interest works in your favor, adding interest back to your principal so your balance grows exponentially over time.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                However, standard loans work on the opposite side of a composite interest calculation. Instead of earning returns, you are paying interest down. In an amortizing loan, interest is calculated on your remaining unpaid principal balance each month. The math relies on variations of the compound interest formula designed to slowly reduce what you owe:
              </p>
              <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                Monthly Interest = Remaining Principal Balance × (Annual Interest Rate / 12)
              </div>
              <p className="text-muted-foreground leading-relaxed">
                As you make each monthly payment, a portion goes toward paying off the interest accrued that month, and the remainder goes toward reducing your principal. As your principal balance drops, the amount of interest you owe the following month drops with it, allowing more of your payment to chip away at the actual debt.
              </p>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Why Map Your Loan Interest with MyApexCalc?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Navigating amortization curves manually is incredibly difficult. MyApexCalc provides a clear, transparent view of your debt schedule so you can plan ahead:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <BarChart className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Interactive Payoff Insights</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Instantly see how much of each monthly payment goes to the lender as interest versus how much goes toward building your actual equity.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Lifetime Cost Summary</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">View the exact sum of money you will pay in interest over the lifetime of your loan under your current interest rate.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Debt Payoff Strategies</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Easily test how making small, additional monthly payments directly to your principal can save you thousands of dollars in lifetime interest.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4">
              <Landmark className="w-10 h-10 text-primary opacity-40 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-tight italic">
                "Understanding the relationship between principal and interest is the first step toward financial freedom."
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
