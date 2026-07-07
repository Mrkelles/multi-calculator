"use client"

import { useState, useEffect, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Calculator, Table as TableIcon, Info, TrendingUp, History } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

export default function InterestCalculatorPage() {
  const [principal, setPrincipal] = useState(10000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(6);
  const [type, setType] = useState<'compound' | 'simple'>('compound');
  const [frequency, setFrequency] = useState('12'); // Monthly default

  const results = useMemo(() => {
    const P = principal;
    const t = years;
    const r = rate / 100;
    const n = parseInt(frequency);

    let totalInterest = 0;
    let finalBalance = 0;
    const yearlySchedule = [];
    const monthlySchedule = [];

    if (type === 'simple') {
      totalInterest = P * r * t;
      finalBalance = P + totalInterest;

      // Schedules for simple interest
      for (let i = 1; i <= t; i++) {
        const yearInterest = P * r;
        yearlySchedule.push({
          period: i,
          interest: yearInterest,
          totalInterest: yearInterest * i,
          balance: P + (yearInterest * i),
        });
      }

      const totalMonths = t * 12;
      for (let i = 1; i <= totalMonths; i++) {
        const monthInterest = (P * r) / 12;
        monthlySchedule.push({
          period: i,
          interest: monthInterest,
          totalInterest: monthInterest * i,
          balance: P + (monthInterest * i),
        });
      }
    } else {
      // Compound Interest: A = P(1 + r/n)^(nt)
      finalBalance = P * Math.pow(1 + r / n, n * t);
      totalInterest = finalBalance - P;

      // Yearly Schedule
      let currentBalance = P;
      for (let i = 1; i <= t; i++) {
        const startBalance = currentBalance;
        currentBalance = P * Math.pow(1 + r / n, n * i);
        const yearInterest = currentBalance - startBalance;
        yearlySchedule.push({
          period: i,
          interest: yearInterest,
          totalInterest: currentBalance - P,
          balance: currentBalance,
        });
      }

      // Monthly Schedule
      let currentMonthlyBalance = P;
      const totalMonths = t * 12;
      for (let i = 1; i <= totalMonths; i++) {
        const startBalance = currentMonthlyBalance;
        // Interest is compounded n times per year
        // We simulate month by month by finding the monthly growth rate
        // Monthly growth factor = (1 + r/n)^(n/12)
        const monthlyGrowth = Math.pow(1 + r / n, n / 12);
        currentMonthlyBalance *= monthlyGrowth;
        const monthInterest = currentMonthlyBalance - startBalance;
        monthlySchedule.push({
          period: i,
          interest: monthInterest,
          totalInterest: currentMonthlyBalance - P,
          balance: currentMonthlyBalance,
        });
      }
    }

    return { totalInterest, finalBalance, yearlySchedule, monthlySchedule };
  }, [principal, years, rate, type, frequency]);

  return (
    <CalculatorWrapper
      title="Interest Calculator"
      description="Calculate simple or compound interest on your savings, investments, or loans with detailed growth schedules."
      icon={Calculator}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Principal Amount ($)</Label>
                <Input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Time Period (Years)</Label>
                  <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Interest Rate (%)</Label>
                  <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Interest Type</Label>
                <Select value={type} onValueChange={(v: any) => setType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compound">Compound Interest</SelectItem>
                    <SelectItem value="simple">Simple Interest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {type === 'compound' && (
                <div className="space-y-2">
                  <Label>Compounding Frequency</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="365">Daily</SelectItem>
                      <SelectItem value="12">Monthly</SelectItem>
                      <SelectItem value="4">Quarterly</SelectItem>
                      <SelectItem value="2">Semiannually</SelectItem>
                      <SelectItem value="1">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                Definitions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-3 text-muted-foreground leading-relaxed">
              <p><strong>Simple Interest:</strong> Interest calculated solely on the initial principal. It does not grow on top of previously earned interest.</p>
              <p><strong>Compound Interest:</strong> Interest calculated on the initial principal and also on the accumulated interest of previous periods.</p>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-primary text-white border-none shadow-lg">
              <CardContent className="pt-6">
                <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1 font-bold">Total Interest</p>
                <h3 className="text-3xl font-bold font-headline">
                  ${results.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </h3>
              </CardContent>
            </Card>
            <Card className="bg-accent text-white border-none shadow-lg">
              <CardContent className="pt-6">
                <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1 font-bold">End Balance</p>
                <h3 className="text-3xl font-bold font-headline">
                  ${results.finalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </h3>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TableIcon className="w-5 h-5 text-primary" />
                Accumulation Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="yearly">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="yearly">Yearly Breakdown</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly Breakdown</TabsTrigger>
                </TabsList>
                
                <TabsContent value="yearly">
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="w-[100px]">Year</TableHead>
                          <TableHead>Interest</TableHead>
                          <TableHead>Total Interest</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.yearlySchedule.map((row) => (
                          <TableRow key={row.period}>
                            <TableCell className="font-medium">{row.period}</TableCell>
                            <TableCell>${row.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                            <TableCell>${row.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                            <TableCell className="text-right font-bold">${row.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
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
                          <TableHead className="w-[100px]">Month</TableHead>
                          <TableHead>Interest</TableHead>
                          <TableHead>Total Interest</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.monthlySchedule.slice(0, 60).map((row) => (
                          <TableRow key={row.period}>
                            <TableCell className="font-medium">{row.period}</TableCell>
                            <TableCell>${row.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                            <TableCell>${row.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                            <TableCell className="text-right font-bold">${row.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                          </TableRow>
                        ))}
                        {results.monthlySchedule.length > 60 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-4 italic">
                              Showing first 60 months...
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Informational Text Section */}
        <div className="lg:col-span-12 space-y-12 py-10">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <History className="w-6 h-6" />
                Understanding Interest
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Interest is essentially the cost of borrowing money or the reward for saving it. At <strong>My Apex Calc</strong>, we provide tools to help you visualize exactly how these percentages translate into real dollars over time. Whether you are looking at a simple car loan or a long-term retirement fund, knowing the difference between simple and compound interest is crucial for financial literacy.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Most modern financial products use <strong>compound interest</strong> because it accounts for the exponential growth of money. As your interest earns interest, your wealth grows at an increasing rate—a phenomenon Einstein famously called the "eighth wonder of the world."
              </p>
            </section>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary">Key Takeaways</h4>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Frequency Matters</p>
                    <p className="text-xs text-muted-foreground">The more frequently interest is compounded (e.g., daily vs. annually), the higher the total end balance will be.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Time is Your Best Friend</p>
                    <p className="text-xs text-muted-foreground">Small interest rates can yield massive results if left to compound for several decades.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
