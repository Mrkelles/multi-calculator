"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { BarChart, TrendingUp, Info, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
} from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function ROIPage() {
  const [startingAmount, setStartingAmount] = useState(20000);
  const [years, setYears] = useState(10);
  const [returnRate, setReturnRate] = useState(6);
  const [compoundFrequency, setCompoundFrequency] = useState('12'); // Monthly default
  const [contribution, setContribution] = useState(1000);
  const [contributionFrequency, setContributionFrequency] = useState('12'); // Monthly
  const [contributionTiming, setContributionTiming] = useState('beginning'); // 'beginning' or 'end'
  
  const [results, setResults] = useState({
    endBalance: 0,
    totalPrincipal: 0,
    totalInterest: 0,
    chartData: [] as any[],
  });

  useEffect(() => {
    const P = startingAmount;
    const t = years;
    const r = returnRate / 100;
    const n = Number(compoundFrequency);
    const PMT = contribution;
    const pmtFreq = Number(contributionFrequency);

    let currentBalance = P;
    let totalInvested = P;
    const yearlyData = [];

    // Monthly simulation for the chart and precision
    for (let year = 0; year <= t; year++) {
      if (year === 0) {
        yearlyData.push({
          year: 0,
          principal: Math.round(P),
          interest: 0,
          total: Math.round(P)
        });
        continue;
      }

      // Simulate 12 months for each year to handle various frequencies accurately
      for (let m = 1; m <= 12; m++) {
        // 1. ADD CONTRIBUTION (IF AT BEGINNING)
        if (contributionTiming === 'beginning') {
          if (pmtFreq === 12 || (pmtFreq === 1 && m === 1)) {
            currentBalance += PMT;
            totalInvested += PMT;
          }
        }

        // 2. CALCULATE INTEREST
        // Calculate the effective monthly rate based on compounding frequency
        // Effective Monthly Rate = (1 + r/n)^(n/12) - 1
        const monthlyRate = Math.pow(1 + r/n, n/12) - 1;
        const interestThisMonth = currentBalance * monthlyRate;
        currentBalance += interestThisMonth;

        // 3. ADD CONTRIBUTION (IF AT END)
        if (contributionTiming === 'end') {
          if (pmtFreq === 12 || (pmtFreq === 1 && m === 12)) {
            currentBalance += PMT;
            totalInvested += PMT;
          }
        }
      }

      yearlyData.push({
        year: year,
        principal: Math.round(totalInvested),
        interest: Math.round(currentBalance - totalInvested),
        total: Math.round(currentBalance)
      });
    }

    setResults({
      endBalance: currentBalance,
      totalPrincipal: totalInvested,
      totalInterest: currentBalance - totalInvested,
      chartData: yearlyData,
    });
  }, [startingAmount, years, returnRate, compoundFrequency, contribution, contributionFrequency, contributionTiming]);

  const chartConfig = {
    principal: {
      label: "Total Principal",
      color: "hsl(var(--primary))",
    },
    interest: {
      label: "Total Interest",
      color: "hsl(var(--accent))",
    },
  };

  return (
    <CalculatorWrapper
      title="Investment ROI Calculator"
      description="Calculate growth with precision. Adjust compounding frequencies and contribution timing to see the 'True Balance'."
      icon={BarChart}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Investment Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="startingAmount">Starting Investment ($)</Label>
                <Input
                  id="startingAmount"
                  type="number"
                  value={startingAmount}
                  onChange={(e) => setStartingAmount(Number(e.target.value))}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Investment Length (Years)</Label>
                  <span className="text-sm font-bold text-primary">{years}</span>
                </div>
                <Slider
                  value={[years]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={(val) => setYears(val[0])}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Return Rate (%)</Label>
                  <span className="text-sm font-bold text-primary">{returnRate}%</span>
                </div>
                <Slider
                  value={[returnRate]}
                  min={0.1}
                  max={25}
                  step={0.1}
                  onValueChange={(val) => setReturnRate(val[0])}
                />
              </div>

              <div className="space-y-2">
                <Label>Compound Frequency</Label>
                <Select value={compoundFrequency} onValueChange={setCompoundFrequency}>
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

              <div className="pt-4 border-t space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Contribution ($)</Label>
                    <Input
                      type="number"
                      value={contribution}
                      onChange={(e) => setContribution(Number(e.target.value))}
                    />
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
                    onValueChange={setContributionTiming}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="beginning" id="beginning" />
                      <Label htmlFor="beginning" className="font-normal">Beginning</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="end" id="end" />
                      <Label htmlFor="end" className="font-normal">End</Label>
                    </div>
                  </RadioGroup>
                  <p className="text-[10px] text-muted-foreground italic">
                    {contributionTiming === 'beginning' 
                      ? "Deposits are added before interest is calculated for the month." 
                      : "Deposits are added after interest is calculated for the month."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-primary text-white border-none shadow-lg">
              <CardContent className="pt-6">
                <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Total Balance</p>
                <h3 className="text-3xl font-bold font-headline">
                  ${results.endBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </h3>
              </CardContent>
            </Card>
            <Card className="bg-accent text-white border-none shadow-lg">
              <CardContent className="pt-6">
                <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Total Interest</p>
                <h3 className="text-3xl font-bold font-headline">
                  ${results.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </h3>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Growth Over Time</CardTitle>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span>Principal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-accent"></div>
                  <span>Interest</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={results.chartData}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="year" 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `$${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar 
                        dataKey="principal" 
                        stackId="a" 
                        fill="var(--color-principal)" 
                        radius={[0, 0, 0, 0]} 
                      />
                      <Bar 
                        dataKey="interest" 
                        stackId="a" 
                        fill="var(--color-interest)" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              
              <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Total Invested</span>
                  <span className="font-bold text-lg">${results.totalPrincipal.toLocaleString()}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-muted-foreground">Total Interest</span>
                  <span className="font-bold text-lg text-accent">${results.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Calculation Logic:</strong> Contributions are simulated monthly. Choosing <strong>Beginning</strong> means deposits earn interest for the full period they are added in, whereas <strong>End</strong> means they only begin earning interest in the subsequent period.
            </p>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
