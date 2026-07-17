"use client"

import { useState, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Percent, 
  ArrowRightLeft, 
  History, 
  Calculator, 
  Info, 
  ChevronDown, 
  ChevronUp,
  ChevronRight,
  Zap,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Accurate Percentage Calculator | Free Math & Discount Tool',
  description: 'Calculate percentages, increases, decreases, and differences instantly. Use our free online percentage calculator to solve any math problem or figure out a percentage.',
  keywords: [
    'percentage calculator',
    'percentage formula',
    'Find percentage online',
    'figure out a percentage',
    'MyApexCalc',
    'percentage finder',
    'percentage difference calculator',
    'percentage of a percentage',
    'change in percentage formula'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Precision Percentage Calculator & Math Tool | MyApexCalc',
    description: 'Solve percentage problems in seconds. Calculate percentage increases, find percentage values, and figure out proportions easily.',
    url: 'https://www.myapexcalc.com/calculators/percentage',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/p6tXgDrR/percentage-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Percentage Calculator and Multi-Function Math Interface',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Instant Online Percentage Solver | MyApexCalc',
    description: 'Quickly calculate percent differences, retail discounts, and financial margins using our intuitive web calculator.',
    images: ['https://i.ibb.co/p6tXgDrR/percentage-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/percentage',
  },
};

export default function PercentageCalculatorPage() {
  // Visibility Toggles
  const [showBasicSteps, setShowBasicSteps] = useState(false);
  const [showDiffSteps, setShowDiffSteps] = useState(false);
  const [showChangeValueSteps, setShowChangeValueSteps] = useState(false);
  const [showChangePercentSteps, setShowChangePercentSteps] = useState(false);

  // 1. Basic Percentage Calculator
  const [p1, setP1] = useState(35);
  const [v1, setV1] = useState(500000);
  const [p2v1, setP2V1] = useState(175000);
  const [p2v2, setP2V2] = useState(500000);
  const [p3v1, setP3V1] = useState(175000);
  const [p3p, setP3P] = useState(35);

  const basicResult1 = useMemo(() => (p1 / 100) * v1, [p1, v1]);
  const basicResult2 = useMemo(() => (p2v1 / p2v2) * 100, [p2v1, p2v2]);
  const basicResult3 = useMemo(() => p3v1 / (p3p / 100), [p3v1, p3p]);

  // 2. Percentage Difference Calculator
  const [d1, setD1] = useState(5000);
  const [d2, setD2] = useState(20000000);

  const diffResult = useMemo(() => {
    const diff = Math.abs(d1 - d2);
    const avg = (d1 + d2) / 2;
    const percentage = (diff / avg) * 100;
    const incDec = ((d2 - d1) / d1) * 100;
    return { percentage, incDec };
  }, [d1, d2]);

  // 3. Percentage Change Calculator (From A to B)
  const [c1, setC1] = useState(5000);
  const [c2, setC2] = useState(7350);

  const changeValueResult = useMemo(() => {
    const diff = c2 - c1;
    const percentage = (diff / c1) * 100;
    return percentage;
  }, [c1, c2]);

  // 4. Percentage Change Calculator (Value +/- %)
  const [cpV, setCpV] = useState(5000);
  const [cpP, setCpP] = useState(47);
  const [cpOp, setCpOp] = useState<'increase' | 'decrease'>('increase');

  const changePercentResult = useMemo(() => {
    const factor = cpOp === 'increase' ? (1 + cpP / 100) : (1 - cpP / 100);
    return cpV * factor;
  }, [cpV, cpP, cpOp]);

  const StepBox = ({ steps, isVisible }: { steps: string[], isVisible: boolean }) => {
    if (!isVisible) return null;
    return (
      <div className="mt-4 p-4 bg-muted/50 rounded-xl border border-dashed border-primary/20 animate-in fade-in slide-in-from-top-2">
        <h4 className="text-[10px] font-black uppercase text-primary tracking-widest mb-3">Calculation Steps</h4>
        <ul className="space-y-2">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3 text-xs text-muted-foreground">
              <span className="font-bold text-primary">{i + 1}.</span>
              <span dangerouslySetInnerHTML={{ __html: s }} />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <CalculatorWrapper
      title="Percentage Calculator"
      description="Powerful tools for calculating percentages, difference between numbers, and relative change with detailed steps."
      icon={Percent}
    >
      <div className="space-y-12 pb-20">
        
        {/* 1. Basic Percentage Calculator */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary"><Calculator size={24} /></div>
            <h3 className="text-2xl font-bold text-primary">Basic Percentage</h3>
          </div>
          <Card>
            <CardContent className="pt-8 space-y-8">
              {/* Row 1: What is P% of V? */}
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium">What is</span>
                <Input type="number" className="w-24 text-center font-bold" value={p1} onChange={e => setP1(Number(e.target.value))} />
                <span className="text-sm font-medium">% of</span>
                <Input type="number" className="w-32 text-center font-bold" value={v1} onChange={e => setV1(Number(e.target.value))} />
                <span className="text-sm font-medium">?</span>
                <div className="flex-1 min-w-[120px] bg-primary/5 p-2 px-4 rounded-lg border border-primary/10 font-black text-primary text-center">
                  {basicResult1.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </div>
              </div>

              {/* Row 2: V1 is what % of V2? */}
              <div className="flex flex-wrap items-center gap-4">
                <Input type="number" className="w-24 text-center font-bold" value={p2v1} onChange={e => setP2V1(Number(e.target.value))} />
                <span className="text-sm font-medium">is what % of</span>
                <Input type="number" className="w-32 text-center font-bold" value={p2v2} onChange={e => setP2V2(Number(e.target.value))} />
                <span className="text-sm font-medium">?</span>
                <div className="flex-1 min-w-[120px] bg-accent/5 p-2 px-4 rounded-lg border border-accent/10 font-black text-accent text-center">
                  {basicResult2.toLocaleString(undefined, { maximumFractionDigits: 4 })}%
                </div>
              </div>

              {/* Row 3: V1 is P% of what? */}
              <div className="flex flex-wrap items-center gap-4">
                <Input type="number" className="w-24 text-center font-bold" value={p3v1} onChange={e => setP3V1(Number(e.target.value))} />
                <span className="text-sm font-medium">is</span>
                <Input type="number" className="w-24 text-center font-bold" value={p3p} onChange={e => setP3P(Number(e.target.value))} />
                <span className="text-sm font-medium">% of what?</span>
                <div className="flex-1 min-w-[120px] bg-primary/5 p-2 px-4 rounded-lg border border-primary/10 font-black text-primary text-center">
                  {basicResult3.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-2"
                  onClick={() => setShowBasicSteps(!showBasicSteps)}
                >
                  {showBasicSteps ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  Show Calculation
                </Button>
                <StepBox 
                  isVisible={showBasicSteps} 
                  steps={[
                    `Calculation 1: ${p1}% of ${v1} = (${p1}/100) × ${v1} = ${(p1/100)} × ${v1} = <strong>${basicResult1}</strong>`,
                    `Calculation 2: ${p2v1} is what % of ${p2v2}? (${p2v1} / ${p2v2}) × 100 = <strong>${basicResult2.toFixed(4)}%</strong>`,
                    `Calculation 3: ${p3v1} is ${p3p}% of what? ${p3v1} / (${p3p}/100) = ${p3v1} / ${(p3p/100)} = <strong>${basicResult3.toFixed(4)}</strong>`
                  ]} 
                />
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* 2. Percentage Difference Calculator */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-xl text-accent"><ArrowRightLeft size={24} /></div>
            <div>
              <h3 className="text-2xl font-bold text-primary">Percentage Difference</h3>
              <p className="text-sm text-muted-foreground">Find the relative difference between two values using the average method.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Value 1</Label>
                    <Input type="number" value={d1} onChange={e => setD1(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Value 2</Label>
                    <Input type="number" value={d2} onChange={e => setD2(Number(e.target.value))} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary text-white border-none shadow-xl flex flex-col justify-center p-8">
              <div className="text-center space-y-4">
                <p className="text-xs uppercase tracking-widest opacity-70 font-bold">Relative Difference</p>
                <div className="text-4xl md:text-5xl font-black font-headline">
                  {diffResult.percentage.toLocaleString(undefined, { maximumFractionDigits: 10 })}%
                </div>
                <Separator className="bg-white/20" />
                <p className="text-sm font-medium leading-relaxed opacity-90">
                  {d2.toLocaleString()} is a <strong>{diffResult.incDec.toLocaleString(undefined, { maximumFractionDigits: 4 })}%</strong> {diffResult.incDec >= 0 ? 'increase' : 'decrease'} of {d1.toLocaleString()}.
                </p>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full bg-white/10 hover:bg-white/20 border-white/10"
                  onClick={() => setShowDiffSteps(!showDiffSteps)}
                >
                  {showDiffSteps ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  Show Calculation
                </Button>
                <div className="text-left">
                  <StepBox 
                    isVisible={showDiffSteps} 
                    steps={[
                      `Formula: |V1 - V2| / ((V1 + V2) / 2) × 100`,
                      `Step 1: |${d1} - ${d2}| = ${Math.abs(d1 - d2)}`,
                      `Step 2: (${d1} + ${d2}) / 2 = ${(d1 + d2) / 2}`,
                      `Step 3: (${Math.abs(d1 - d2)} / ${(d1 + d2) / 2}) × 100 = <strong>${diffResult.percentage.toFixed(10)}%</strong>`,
                      `Relative Increase: (${d2} - ${d1}) / ${d1} × 100 = <strong>${diffResult.incDec.toFixed(4)}%</strong>`
                    ]} 
                  />
                </div>
              </div>
            </Card>
          </div>
        </section>

        <Separator />

        {/* 3. Percentage Change Calculator (From A to B) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary"><TrendingUp size={24} /></div>
            <div>
              <h3 className="text-2xl font-bold text-primary">Percentage Change (From A to B)</h3>
              <p className="text-sm text-muted-foreground">Calculate the percentage of increase or decrease between two values.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-7">
              <CardContent className="pt-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Start Value</Label>
                    <Input type="number" value={c1} onChange={e => setC1(Number(e.target.value))} />
                  </div>
                  <div className="pt-6">→</div>
                  <div className="flex-1 space-y-2">
                    <Label>End Value</Label>
                    <Input type="number" value={c2} onChange={e => setC2(Number(e.target.value))} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="lg:col-span-5 space-y-4">
              <Card className="bg-accent text-white border-none shadow-lg text-center p-8">
                <p className="text-xs uppercase tracking-widest opacity-70 font-bold mb-4">Calculated Change</p>
                <div className="flex items-center justify-center gap-2">
                  {changeValueResult >= 0 ? <ArrowUpRight className="w-8 h-8 text-emerald-300" /> : <ArrowDownRight className="w-8 h-8 text-red-300" />}
                  <div className="text-5xl font-black font-headline">{Math.abs(changeValueResult).toLocaleString(undefined, { maximumFractionDigits: 4 })}%</div>
                </div>
                <p className="mt-2 font-bold uppercase text-[10px] tracking-widest text-white/60">
                  {changeValueResult >= 0 ? 'Increase' : 'Decrease'}
                </p>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full mt-6 bg-white/10 hover:bg-white/20 border-white/10"
                  onClick={() => setShowChangeValueSteps(!showChangeValueSteps)}
                >
                  {showChangeValueSteps ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  Show Calculation
                </Button>
                <div className="text-left">
                  <StepBox 
                    isVisible={showChangeValueSteps} 
                    steps={[
                      `Formula: ((End - Start) / Start) × 100`,
                      `Step 1: ${c2} - ${c1} = ${c2 - c1}`,
                      `Step 2: (${c2 - c1} / ${c1}) = ${(c2 - c1) / c1}`,
                      `Step 3: ${(c2 - c1) / c1} × 100 = <strong>${changeValueResult.toFixed(4)}%</strong>`
                    ]} 
                  />
                </div>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        {/* 4. Percentage Increase/Decrease (Value +/- %) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-xl text-accent"><Zap size={24} /></div>
            <div>
              <h3 className="text-2xl font-bold text-primary">Percentage Increase/Decrease (Value & %)</h3>
              <p className="text-sm text-muted-foreground">Adjust a value by a specific percentage to find the final result.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-7">
              <CardContent className="pt-8 flex flex-wrap items-center gap-4">
                <div className="space-y-2 flex-1 min-w-[120px]">
                  <Label>Base Value</Label>
                  <Input type="number" value={cpV} onChange={e => setCpV(Number(e.target.value))} />
                </div>
                <div className="space-y-2 w-32">
                  <Label>Action</Label>
                  <Select value={cpOp} onValueChange={(v: any) => setCpOp(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="increase">Increase</SelectItem>
                      <SelectItem value="decrease">Decrease</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 w-24">
                  <Label>By (%)</Label>
                  <Input type="number" value={cpP} onChange={e => setCpP(Number(e.target.value))} />
                </div>
              </CardContent>
            </Card>
            <div className="lg:col-span-5 space-y-4">
              <Card className="bg-primary text-white border-none shadow-xl text-center p-8">
                <p className="text-xs uppercase tracking-widest opacity-70 font-bold mb-4">Final Value</p>
                <div className="text-5xl font-black font-headline">
                  {changePercentResult.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full mt-6 bg-white/10 hover:bg-white/20 border-white/10"
                  onClick={() => setShowChangePercentSteps(!showChangePercentSteps)}
                >
                  {showChangePercentSteps ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  Show Calculation
                </Button>
                <div className="text-left">
                  <StepBox 
                    isVisible={showChangePercentSteps} 
                    steps={[
                      `Operation: ${cpV} ${cpOp} by ${cpP}%`,
                      `Step 1: ${cpP}% of ${cpV} = (${cpP}/100) × ${cpV} = ${((cpP/100) * cpV).toFixed(4)}`,
                      `Step 2: ${cpV} ${cpOp === 'increase' ? '+' : '-'} ${((cpP/100) * cpV).toFixed(4)} = <strong>${changePercentResult.toFixed(4)}</strong>`,
                      `Quick Formula: ${cpV} × (1 ${cpOp === 'increase' ? '+' : '-'} ${cpP/100}) = <strong>${changePercentResult.toFixed(4)}</strong>`
                    ]} 
                  />
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Informational Text Section */}
        <div className="lg:col-span-12 py-10 space-y-12">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Simplify Your Everyday Math with MyApexCalc
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Whether you are trying to calculate the final price of a sale item at a store, figure out the tip for a restaurant bill, analyze financial growth trends in a business report, or help your kids with their math homework, percentages are everywhere. Yet, trying to mental-math these figures or remember old high school math rules can be frustrating. Our free online percentage calculator is built to solve any percentage equation instantly, serving as your ultimate tool to find percentage online without picking up a pencil.
              </p>
              
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
                <Calculator className="w-6 h-6" />
                Understanding the Formulas: How to Figure Out a Percentage
              </h3>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  A percentage is simply a ratio or a fraction expressed out of a whole of $100$. Depending on the specific question you are trying to answer, the mathematical percentage formula changes slightly. Our multi-function dashboard supports the three most common calculation modes:
                </p>

                <div className="space-y-2">
                  <p className="font-bold text-sm text-foreground">1. Finding a Percent of a Value</p>
                  <p className="text-sm text-muted-foreground">Use this when you want to calculate a specific slice of a number (such as finding a $15\%$ tip on a $\$60$ restaurant bill):</p>
                  <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                    Value = Total × ( Percentage / 100 )
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-sm text-foreground">2. Finding the Percentage of a Fraction</p>
                  <p className="text-sm text-muted-foreground">Use this when you have two numbers and want to find what percentage one is of the other (for example, finding your score percentage if you got $45$ out of $50$ questions right on a test):</p>
                  <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                    Percentage = ( Part / Whole ) × 100
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-sm text-foreground">3. Calculating Percentage Increase or Decrease</p>
                  <p className="text-sm text-muted-foreground">Use this when tracking growth, losses, or retail discounts (such as calculating the percentage drop when a stock price falls from $\$120$ to $\$90$):</p>
                  <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                    Percentage Change = ( (New Value - Original Value) / Original Value ) × 100
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed pt-2">
                  Our platform automatically processes these mathematical steps behind the scenes, allowing you to plug in your raw numbers and receive a clean, immediate answer.
                </p>
              </div>
            </section>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Why Use the MyApexCalc Percentage Calculator?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Instead of scratching your head trying to figure out a percentage manually or wrestling with generic phone calculator apps, MyApexCalc provides:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">All-in-One Multi-Utility Tabs</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Easily switch between basic percent calculations, percentage changes, and value proportions depending on your specific question.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Flawless Precision</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Our tool calculates figures down to the exact decimal, eliminating rounding errors for business bookkeeping, budgeting, or scientific analysis.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Responsive, Real-Time Calculations</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Simply type your values into the boxes to watch your answers update instantly as you type.</p>
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
