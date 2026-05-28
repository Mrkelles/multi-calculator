"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Calculator } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    </CalculatorWrapper>
  );
}