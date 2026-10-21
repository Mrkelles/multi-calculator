"use client"

import { useState, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Calculator, Table as TableIcon, Info, TrendingUp, History, Clock, Lightbulb } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Interest Calculator | Simple & Compound Interest Growth',
  description: 'Calculate simple and compound interest with recurring contributions. View detailed yearly and monthly growth schedules.',
  keywords: ['interest calculator', 'simple interest', 'compound interest', 'investment growth', 'savings interest'],
  openGraph: {
    title: 'Precision Interest Rate & APR Calculator | MyApexCalc',
    description: 'Deconstruct your borrowing or growth rates. Calculate interest amounts, analyze mortgage components, and find your true APR easily.',
    url: 'https://www.myapexcalc.com/calculators/interest',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/tt9jyBz/compound-interest-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Interest Rate Calculator, APR Solver, and Investment Progression Screen',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Interest Amount & APR Calculator | MyApexCalc',
    description: 'Determine actual borrowing fees, monthly mortgage percentages, and investment yields in seconds.',
    images: ['https://i.ibb.co/tt9jyBz/compound-interest-calculator.png'],
  },
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/interest',
  },
};

export default function InterestCalculatorPage() {
  const [principal, setPrincipal] = useState(10000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(6);
  const [type, setType] = useState<'compound' | 'simple'>('compound');
  const [frequency, setFrequency] = useState('12'); 
  const [contribution, setContribution] = useState(500);
  const [contributionFrequency, setContributionFrequency] = useState('12'); 
  const [contributionTiming, setContributionTiming] = useState<'beginning' | 'end'>('beginning');

  const results = useMemo(() => {
    const P = principal;
    const t = years;
    const r = rate / 100;
    const n = parseInt(frequency);
    const PMT = contribution;
    const pmtFreq = parseInt(contributionFrequency);
    
    let totalIntAccumulated = 0;
    const yearlySchedule = [];
    const monthlySchedule = [];

    let currentBalance = P;
    let totalInvested = P;

    const totalMonths = t * 12;

    for (let m = 1; m <= totalMonths; m++) {
      const isContributionMonth = (12 / pmtFreq) === 1 || (m % (12 / pmtFreq) === 0);

      if (contributionTiming === 'beginning' && isContributionMonth) {
        currentBalance += PMT;
        totalInvested += PMT;
      }

      let monthInterest = 0;

      if (type === 'simple') {
        monthInterest = (currentBalance * r) / 12;
      } else {
        const monthlyRate = Math.pow(1 + r / n, n / 12) - 1;
        monthInterest = currentBalance * monthlyRate;
        currentBalance += monthInterest;
      }
      
      totalIntAccumulated += monthInterest;

      if (contributionTiming === 'end' && isContributionMonth) {
        currentBalance += PMT;
        totalInvested += PMT;
      }

      monthlySchedule.push({
        period: m,
        interest: monthInterest,
        totalInterest: totalIntAccumulated,
        balance: type === 'simple' ? totalInvested + totalIntAccumulated : currentBalance,
      });

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

    const finalBalance = type === 'simple' ? totalInvested + totalIntAccumulated : currentBalance;
    const totalInterest = totalIntAccumulated;

    return { totalInterest, finalBalance, totalInvested, yearlySchedule, monthlySchedule };
  }, [principal, years, rate, type, frequency, contribution, contributionFrequency, contributionTiming]);

  return (
    <CalculatorWrapper
      title="Interest Calculator"
      description="Calculate simple or compound interest with regular contributions and detailed accumulation schedules."
      icon={Calculator}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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

          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-3">
            <h4 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Info size={16} /> Disclaimer
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              Interest calculations are estimates based on the principal, interest rate, time period, compounding method, and contribution assumptions entered. Actual interest earned or paid may differ because of account terms, lender policies, rate changes, fees, taxes, and calculation conventions. This calculator does not represent an offer from a financial institution or guarantee a particular return. Verify all rates and terms with the relevant bank, lender, or financial provider.
            </p>
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
                          <TableHead>Year</TableHead>
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
                          <TableHead>Month</TableHead>
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
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-12 py-10 space-y-12">
          <Separator />
          <section className="space-y-6 text-left">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-xl text-accent"><Lightbulb size={24} /></div>
              <h3 className="text-2xl font-bold text-primary">Worked Examples</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm bg-muted/20">
                <CardHeader>
                  <CardTitle className="text-lg">Scenario 1: Simple vs. Compound Growth</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>A user invests <strong>$10,000 at 8%</strong> interest for 10 years. Under **Simple Interest**, they earn exactly <strong>$8,000</strong> in interest ($800 per year).</p>
                  <p>Under **Compound Interest** (compounded annually), they earn <strong>$11,589</strong>. By allowing the interest to earn interest, they gain an extra <strong>$3,589</strong> with no extra effort.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-muted/20">
                <CardHeader>
                  <CardTitle className="text-lg">Scenario 2: The Impact of Frequency</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Comparing compounding frequencies on a <strong>$50,000 investment at 5%</strong> for 20 years. **Annual Compounding** results in a balance of <strong>$132,665</strong>.</p>
                  <p>**Daily Compounding** results in <strong>$135,903</strong>. The difference in frequency alone yields an additional <strong>$3,238</strong> for the saver.</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
