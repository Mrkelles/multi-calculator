"use client"

import { useState, useEffect, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Calculator, Table as TableIcon, Info, TrendingUp, History, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function InterestCalculatorPage() {
  const [principal, setPrincipal] = useState(10000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(6);
  const [type, setType] = useState<'compound' | 'simple'>('compound');
  const [frequency, setFrequency] = useState('12'); // Compounding Frequency
  const [contribution, setContribution] = useState(500);
  const [contributionFrequency, setContributionFrequency] = useState('12'); // 12 for monthly, 1 for yearly
  const [contributionTiming, setContributionTiming] = useState<'beginning' | 'end'>('beginning');

  const results = useMemo(() => {
    const P = principal;
    const t = years;
    const r = rate / 100;
    const n = parseInt(frequency);
    const PMT = contribution;
    const pmtFreq = parseInt(contributionFrequency);
    
    let totalInterest = 0;
    let finalBalance = 0;
    const yearlySchedule = [];
    const monthlySchedule = [];

    let currentBalance = P;
    let totalInvested = P;
    let totalIntAccumulated = 0;

    // We use a monthly simulation for high precision across both simple and compound
    const totalMonths = t * 12;

    for (let m = 1; m <= totalMonths; m++) {
      const isContributionMonth = (12 / pmtFreq) === 1 || (m % (12 / pmtFreq) === 0);

      // 1. BEGINNING CONTRIBUTION
      if (contributionTiming === 'beginning' && isContributionMonth) {
        currentBalance += PMT;
        totalInvested += PMT;
      }

      const startBalance = currentBalance;
      let monthInterest = 0;

      if (type === 'simple') {
        // Simple Interest: Each dollar in the account earns interest based on time remaining
        // We calculate interest on the CURRENT principal balance for 1 month
        monthInterest = (currentBalance * r) / 12;
        // In simple interest, interest doesn't compound (is not added to the principal for next month's calculation)
        // However, for the purpose of "Total Interest" and "Final Balance", we track it.
      } else {
        // Compound Interest: Compounding n times per year
        // Effective Monthly Rate = (1 + r/n)^(n/12) - 1
        const monthlyRate = Math.pow(1 + r / n, n / 12) - 1;
        monthInterest = currentBalance * monthlyRate;
        currentBalance += monthInterest;
      }
      
      totalIntAccumulated += monthInterest;

      // 2. END CONTRIBUTION
      if (contributionTiming === 'end' && isContributionMonth) {
        currentBalance += PMT;
        totalInvested += PMT;
      }

      // Record Monthly Schedule
      monthlySchedule.push({
        period: m,
        interest: monthInterest,
        totalInterest: totalIntAccumulated,
        balance: type === 'simple' ? totalInvested + totalIntAccumulated : currentBalance,
      });

      // Record Yearly Schedule
      if (m % 12 === 0) {
        const year = m / 12;
        yearlySchedule.push({
          period: year,
          interest: monthlySchedule.slice(-12).reduce((sum, item) => sum + item.interest, 0),
          totalInterest: totalIntAccumulated,
          balance: type === 'simple' ? totalInvested + totalIntAccumulated : currentBalance,
        });
      }
    }

    finalBalance = type === 'simple' ? totalInvested + totalIntAccumulated : currentBalance;
    totalInterest = totalIntAccumulated;

    return { totalInterest, finalBalance, totalInvested, yearlySchedule, monthlySchedule };
  }, [principal, years, rate, type, frequency, contribution, contributionFrequency, contributionTiming]);

  return (
    <CalculatorWrapper
      title="Interest Calculator"
      description="Calculate simple or compound interest with regular contributions and detailed accumulation schedules."
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
                  <Label>Annual Rate (%)</Label>
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

              <Separator />

              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Contribution ($)</Label>
                    <Input type="number" value={contribution} onChange={(e) => setContribution(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select value={contributionFrequency} onValueChange={setContributionFrequency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">Monthly</SelectItem>
                        <SelectItem value="1">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    Contribution Timing
                  </Label>
                  <RadioGroup 
                    value={contributionTiming} 
                    onValueChange={(v: any) => setContributionTiming(v)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="beginning" id="beginning" />
                      <Label htmlFor="beginning" className="font-normal cursor-pointer">Beginning</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="end" id="end" />
                      <Label htmlFor="end" className="font-normal cursor-pointer">End</Label>
                    </div>
                  </RadioGroup>
                  <p className="text-[10px] text-muted-foreground italic">
                    {contributionTiming === 'beginning' 
                      ? "Deposits are added before interest is calculated for the period." 
                      : "Deposits are added after interest is calculated for the period."}
                  </p>
                </div>
              </div>
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
              <p><strong>Simple Interest:</strong> Interest calculated only on the principal amounts (initial and added). It does not earn interest on interest.</p>
              <p><strong>Compound Interest:</strong> Interest earned is added back to the principal, so the next period earns interest on that interest as well.</p>
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
                          <TableHead className="w-[80px]">Year</TableHead>
                          <TableHead>Year Interest</TableHead>
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
                          <TableHead className="w-[80px]">Month</TableHead>
                          <TableHead>Interest</TableHead>
                          <TableHead>Total Interest</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.monthlySchedule.slice(0, 120).map((row) => (
                          <TableRow key={row.period}>
                            <TableCell className="font-medium">{row.period}</TableCell>
                            <TableCell>${row.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                            <TableCell>${row.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                            <TableCell className="text-right font-bold">${row.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                          </TableRow>
                        ))}
                        {results.monthlySchedule.length > 120 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-4 italic">
                              Showing first 120 months...
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
                    <p className="font-bold text-sm">Timing Matters</p>
                    <p className="text-xs text-muted-foreground">Contributing at the <strong>Beginning</strong> of a month allows that money to earn interest for that full month, significantly boosting long-term gains.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Frequency is Key</p>
                    <p className="text-xs text-muted-foreground">The more frequently interest is compounded (e.g., daily vs. annually), the higher the total end balance will be.</p>
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
