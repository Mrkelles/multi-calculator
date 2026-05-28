"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { BarChart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ROIPage() {
  const [cost, setCost] = useState(10000);
  const [revenue, setRevenue] = useState(15000);
  const [roi, setRoi] = useState(0);
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    if (cost > 0) {
      const net = revenue - cost;
      const percentage = (net / cost) * 100;
      setProfit(net);
      setRoi(percentage);
    }
  }, [cost, revenue]);

  return (
    <CalculatorWrapper
      title="ROI Calculator"
      description="Measure the efficiency and profitability of your investments."
      icon={BarChart}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Investment Values</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cost">Amount Invested (Cost)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="cost"
                  className="pl-7"
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="revenue">Amount Returned (Revenue)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="revenue"
                  className="pl-7"
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-accent text-white border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest opacity-80">Return on Investment</CardTitle>
            </CardHeader>
            <CardContent className="py-6">
              <div className="text-6xl font-bold font-headline">
                {roi.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card className={profit >= 0 ? "border-green-200" : "border-red-200"}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">Net Profit/Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold font-headline ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${profit.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                ROI = (Net Profit / Cost of Investment) × 100
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </CalculatorWrapper>
  );
}