"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { CreditCard, TrendingDown, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function DebtPayoffPage() {
  const [balance, setBalance] = useState(10000);
  const [interest, setInterest] = useState(19.99);
  const [payment, setPayment] = useState(300);
  const [months, setMonths] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);

  useEffect(() => {
    const P = balance;
    const r = interest / 100 / 12;
    const PMT = payment;

    if (PMT <= P * r) {
      setMonths(-1); // Infinite debt
      return;
    }

    // Formula: n = -ln(1 - (P*r/PMT)) / ln(1+r)
    const n = -Math.log(1 - (P * r) / PMT) / Math.log(1 + r);
    setMonths(Math.ceil(n));
    setTotalPaid(Math.ceil(n) * PMT);
  }, [balance, interest, payment]);

  return (
    <CalculatorWrapper
      title="Debt Payoff Calculator"
      description="Find out how long it will take to pay off your credit card or loan and how much interest you'll save by paying more."
      icon={CreditCard}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader><CardTitle className="text-lg">Debt Details</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Current Balance ($)</Label>
              <Input type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Annual Interest Rate (%)</Label>
              <Input type="number" value={interest} onChange={(e) => setInterest(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Monthly Payment ($)</Label>
              <Input type="number" value={payment} onChange={(e) => setPayment(Number(e.target.value))} />
            </div>
            {payment <= (balance * (interest / 100 / 12)) && (
              <div className="bg-red-50 text-red-600 p-3 rounded text-xs font-bold border border-red-200">
                Warning: Monthly payment is too low. Debt will never be paid off because it doesn't cover the interest.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary text-white text-center py-10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest opacity-80">Time to Pay Off</CardTitle>
            </CardHeader>
            <CardContent>
              {months === -1 ? (
                <div className="text-4xl font-bold">Infinite</div>
              ) : (
                <>
                  <div className="text-6xl font-bold font-headline">{months}</div>
                  <p className="mt-2 text-xl font-medium opacity-80">Months</p>
                  <p className="mt-4 text-xs opacity-60">≈ {(months / 12).toFixed(1)} Years</p>
                </>
              )}
            </CardContent>
          </Card>

          {months !== -1 && (
            <Card>
              <CardHeader><CardTitle className="text-sm">Cost Breakdown</CardTitle></CardHeader>
              <CardContent className="text-xs space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Total Amount Paid</span>
                  <span className="font-bold">${totalPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2 text-red-500">
                  <span className="font-medium">Total Interest Paid</span>
                  <span className="font-bold">${(totalPaid - balance).toLocaleString()}</span>
                </div>
                <div className="pt-2 flex items-center gap-2 text-blue-600 bg-blue-50 p-2 rounded">
                  <Info size={14} />
                  <span>Increasing payment by $100 could save months of time.</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </CalculatorWrapper>
  );
}
