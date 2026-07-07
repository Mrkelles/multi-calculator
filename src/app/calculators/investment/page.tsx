"use client"

import { useState, useEffect, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  TrendingUp, 
  Table as TableIcon, 
  Info, 
  DollarSign, 
  Clock, 
  Calendar,
  History,
  Zap,
  Target
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

type CalcMode = 'end-amount' | 'contribution' | 'return-rate' | 'starting-amount' | 'length';

export default function InvestmentCalculatorPage() {
  const [mode, setMode] = useState<CalcMode>('end-amount');

  // Inputs
  const [startingAmount, setStartingAmount] = useState(25000);
  const [targetAmount, setTargetAmount] = useState(100000);
  const [years, setYears] = useState(10);
  const [returnRate, setReturnRate] = useState(7);
  const [contribution, setContribution] = useState(500);
  const [compoundFrequency, setCompoundFrequency] = useState('12');
  const [contributionFrequency, setContributionFrequency] = useState('12');
  const [contributionTiming, setContributionTiming] = useState<'beginning' | 'end'>('beginning');

  const results = useMemo(() => {
    const P = startingAmount;
    const t = years;
    const r = returnRate / 100;
    const n = Number(compoundFrequency);
    const pmtFreq = Number(contributionFrequency);
    const timing = contributionTiming;
    const G = targetAmount;

    let solvedValue = 0;
    let finalP = P;
    let finalYears = t;
    let finalRate = r;
    let finalContribution = contribution;

    // Simulation logic to calculate future value
    const simulate = (p: number, yrs: number, rate: number, contrib: number) => {
      let balance = p;
      let totalContrib = p;
      const monthlyData = [];
      const totalMonths = Math.ceil(yrs * 12);
      
      for (let m = 1; m <= totalMonths; m++) {
        const isContribMonth = (12 / pmtFreq) === 1 || (m % (12 / pmtFreq) === 0);
        
        if (timing === 'beginning' && isContribMonth) {
          balance += contrib;
          totalContrib += contrib;
        }

        const monthlyRate = Math.pow(1 + rate / n, n / 12) - 1;
        const interest = balance * monthlyRate;
        balance += interest;

        if (timing === 'end' && isContribMonth) {
          balance += contrib;
          totalContrib += contrib;
        }

        monthlyData.push({ period: m, balance, totalContrib });
      }
      return { balance, totalContrib, monthlyData };
    };

    if (mode === 'end-amount') {
      const sim = simulate(P, t, r, contribution);
      solvedValue = sim.balance;
    } else if (mode === 'starting-amount') {
      // Algebraic solve for P
      // FV = P(1+r/n)^nt + PMT * [((1+r/n)^nt - 1) / (r/n)] * (1 + r/n if beginning)
      // This is complex with various frequencies, so we use a simplified simulation or solve
      // Let's use a simulation-based binary search for robustness if P is not simple
      let low = 0, high = G * 2;
      for (let i = 0; i < 40; i++) {
        let mid = (low + high) / 2;
        if (simulate(mid, t, r, contribution).balance < G) low = mid;
        else high = mid;
      }
      solvedValue = high;
      finalP = solvedValue;
    } else if (mode === 'contribution') {
      let low = 0, high = G;
      for (let i = 0; i < 40; i++) {
        let mid = (low + high) / 2;
        if (simulate(P, t, r, mid).balance < G) low = mid;
        else high = mid;
      }
      solvedValue = high;
      finalContribution = solvedValue;
    } else if (mode === 'return-rate') {
      let low = 0, high = 1; // 0% to 100%
      for (let i = 0; i < 40; i++) {
        let mid = (low + high) / 2;
        if (simulate(P, t, mid, contribution).balance < G) low = mid;
        else high = mid;
      }
      solvedValue = high * 100;
      finalRate = high;
    } else if (mode === 'length') {
      let low = 0, high = 100; // 0 to 100 years
      for (let i = 0; i < 40; i++) {
        let mid = (low + high) / 2;
        if (simulate(P, mid, r, contribution).balance < G) low = mid;
        else high = mid;
      }
      solvedValue = high;
      finalYears = solvedValue;
    }

    // Final Schedules based on solved parameters
    const finalSim = simulate(finalP, finalYears, finalRate, finalContribution);
    const yearlySchedule = [];
    const monthlySchedule = [];

    finalSim.monthlyData.forEach((item, idx) => {
      if ((idx + 1) % 12 === 0 || (idx + 1) === finalSim.monthlyData.length) {
        yearlySchedule.push({
          period: Math.ceil((idx + 1) / 12),
          balance: item.balance,
          interest: item.balance - item.totalContrib,
          totalPrincipal: item.totalContrib
        });
      }
      if (idx < 120) { // Limit monthly to first 10 years for performance
        monthlySchedule.push({
          period: idx + 1,
          balance: item.balance,
          interest: item.balance - item.totalContrib,
          totalPrincipal: item.totalContrib
        });
      }
    });

    return { 
      solvedValue, 
      finalBalance: finalSim.balance, 
      totalPrincipal: finalSim.totalContrib, 
      totalInterest: finalSim.balance - finalSim.totalContrib,
      yearlySchedule,
      monthlySchedule
    };
  }, [mode, startingAmount, targetAmount, years, returnRate, contribution, compoundFrequency, contributionFrequency, contributionTiming]);

  return (
    <CalculatorWrapper
      title="Investment Calculator"
      description="Advanced financial modeling to determine target end amounts, required contributions, or timeframes needed to hit your goals."
      icon={TrendingUp}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
                <TabsList className="grid grid-cols-3 md:grid-cols-5 h-auto py-1 px-1">
                  <TabsTrigger value="end-amount" className="text-[10px] md:text-xs">End Amt</TabsTrigger>
                  <TabsTrigger value="contribution" className="text-[10px] md:text-xs">Contrib</TabsTrigger>
                  <TabsTrigger value="return-rate" className="text-[10px] md:text-xs">Rate</TabsTrigger>
                  <TabsTrigger value="starting-amount" className="text-[10px] md:text-xs">Start</TabsTrigger>
                  <TabsTrigger value="length" className="text-[10px] md:text-xs">Years</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 mb-2">
                <p className="text-[10px] uppercase font-black text-primary tracking-widest flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> Solving For: {mode.replace('-', ' ')}
                </p>
              </div>

              {mode !== 'starting-amount' && (
                <div className="space-y-2">
                  <Label>Starting Amount ($)</Label>
                  <Input type="number" value={startingAmount} onChange={(e) => setStartingAmount(Number(e.target.value))} />
                </div>
              )}

              {mode !== 'end-amount' && (
                <div className="space-y-2">
                  <Label>Target End Amount ($)</Label>
                  <Input type="number" value={targetAmount} onChange={(e) => setTargetAmount(Number(e.target.value))} />
                </div>
              )}

              {mode !== 'length' && (
                <div className="space-y-2">
                  <Label>Investment Length (Years)</Label>
                  <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
                </div>
              )}

              {mode !== 'return-rate' && (
                <div className="space-y-2">
                  <Label>Expected Return Rate (%)</Label>
                  <Input type="number" step="0.1" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
                </div>
              )}

              {mode !== 'contribution' && (
                <div className="space-y-2">
                  <Label>Periodic Contribution ($)</Label>
                  <Input type="number" value={contribution} onChange={(e) => setContribution(Number(e.target.value))} />
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Compounding</Label>
                  <Select value={compoundFrequency} onValueChange={setCompoundFrequency}>
                    <SelectTrigger className="h-9 text-xs">
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
                <div className="space-y-2">
                  <Label className="text-xs">Contribution Freq</Label>
                  <Select value={contributionFrequency} onValueChange={setContributionFrequency}>
                    <SelectTrigger className="h-9 text-xs">
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
                <Label className="text-xs flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Contribution Timing
                </Label>
                <RadioGroup 
                  value={contributionTiming} 
                  onValueChange={(v: any) => setContributionTiming(v)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginning" id="beginning" />
                    <Label htmlFor="beginning" className="text-xs cursor-pointer">Beginning</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="end" id="end" />
                    <Label htmlFor="end" className="text-xs cursor-pointer">End</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" /> Term Glossary
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[10px] text-muted-foreground space-y-2 leading-relaxed">
              <p><strong>Compounding:</strong> The process where value is calculated on both the original principal and accumulated interest.</p>
              <p><strong>Contribution Timing:</strong> <em>Beginning</em> assumes money is added before interest is calculated for that period, maximizing growth.</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-primary text-white border-none shadow-xl">
            <CardContent className="pt-10 pb-10 text-center">
              <p className="text-xs uppercase tracking-widest opacity-70 mb-2 font-bold">
                {mode === 'end-amount' ? 'Projected End Balance' : 
                 mode === 'contribution' ? 'Required Contribution' :
                 mode === 'return-rate' ? 'Required Return Rate' :
                 mode === 'starting-amount' ? 'Required Starting Principal' :
                 'Required Investment Time'}
              </p>
              <h3 className="text-5xl md:text-6xl font-black font-headline tracking-tighter">
                {mode === 'return-rate' ? 
                  `${results.solvedValue.toFixed(2)}%` : 
                  mode === 'length' ? 
                  `${results.solvedValue.toFixed(1)} Years` :
                  `$${results.solvedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                }
              </h3>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs uppercase text-muted-foreground font-bold">Total Principal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${results.totalPrincipal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs uppercase text-accent font-bold">Total Interest</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">${results.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
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
                          <TableHead>Year</TableHead>
                          <TableHead>Principal</TableHead>
                          <TableHead>Interest</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.yearlySchedule.map((row) => (
                          <TableRow key={row.period}>
                            <TableCell className="font-medium">{row.period}</TableCell>
                            <TableCell className="text-xs">${row.totalPrincipal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                            <TableCell className="text-xs">${row.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                            <TableCell className="text-right font-bold text-xs">${row.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
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
                        {results.monthlySchedule.map((row) => (
                          <TableRow key={row.period}>
                            <TableCell className="font-medium">{row.period}</TableCell>
                            <TableCell className="text-xs">${row.totalPrincipal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                            <TableCell className="text-xs">${row.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                            <TableCell className="text-right font-bold text-xs">${row.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
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

        {/* Informational Text Section */}
        <div className="lg:col-span-12 space-y-12 py-10">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <History className="w-6 h-6" />
                Planning Your Investment
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                The <strong>My Apex Investment Calculator</strong> is more than just a multiplier. It is a reverse-engineering tool for your financial goals. By allowing you to solve for five different variables, we give you the flexibility to adapt to your current life stage.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you are trying to find out how many years it will take to reach $1 million, or how much more you need to save per month to retire early, our simulation-based modeling provides the accuracy you need.
              </p>
            </section>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary">Calculation Modes Explained</h4>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Target className="w-3 h-3 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Target Solving</p>
                    <p className="text-xs text-muted-foreground">Select <strong>Contrib</strong> or <strong>Years</strong> to work backwards from a specific goal amount, helping you build a concrete savings roadmap.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Compound Frequency</p>
                    <p className="text-xs text-muted-foreground">The more often interest is compounded (e.g., daily), the faster your money grows. Most high-yield savings accounts compound daily or monthly.</p>
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
