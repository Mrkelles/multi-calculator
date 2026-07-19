"use client"

import { useState, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Sigma, 
  Info, 
  History, 
  Calculator, 
  ChevronDown, 
  ChevronUp,
  BarChart,
  LayoutGrid,
  FileText,
  TrendingUp,
  Zap,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component to ensure it is picked up by SEO crawlers.
const metadata: Metadata = {
  title: 'Accurate Standard Deviation Calculator | Free Statistics Tool',
  description: 'Calculate standard deviation, variance, mean, and margin of error instantly. Try our free online standard deviation calculator for both sample and population datasets.',
  keywords: [
    'Standard Deviation formula',
    'equation for standard deviation',
    'Standard Deviation Calculator',
    'find the standard deviation',
    'determining standard deviation',
    'MyApexCalc',
    'variance calculator',
    'population standard deviation solver'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Precision Standard Deviation & Variance Calculator | MyApexCalc',
    description: 'Analyze your datasets with confidence. Compute standard deviation, variance, mean, and range instantly with our free statistical calculator.',
    url: 'https://www.myapexcalc.com/calculators/standard-deviation',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/2DNnXpV/standard-deviation-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Standard Deviation Calculator displaying step-by-step statistical formulas and dataset analysis',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Free Statistical Standard Deviation Tool | MyApexCalc',
    description: 'Instantly calculate sample or population standard deviation, mean, and variance. Features step-by-step mathematical breakdown.',
    images: ['https://i.ibb.co/2DNnXpV/standard-deviation-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/standard-deviation',
  },
};

export default function StandardDeviationPage() {
  const [dataInput, setDataInput] = useState('10, 12, 23, 23, 16, 23, 21, 16');
  const [type, setType] = useState<'population' | 'sample'>('population');
  const [showSteps, setShowSteps] = useState(false);

  const results = useMemo(() => {
    const rawNumbers = dataInput.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && typeof n === 'number' && isFinite(n));
    if (rawNumbers.length < 2) return null;

    const n = rawNumbers.length;
    const sum = rawNumbers.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    
    // Sum of (xi - mean)^2
    const sumSqDiff = rawNumbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
    
    const variance = type === 'population' ? sumSqDiff / n : sumSqDiff / (n - 1);
    const stdDev = Math.sqrt(variance);
    
    const sem = stdDev / Math.sqrt(n);

    // Confidence Levels
    const levels = [
      { label: '68.3%', multiplier: 1.0 },
      { label: '90%', multiplier: 1.645 },
      { label: '95%', multiplier: 1.960 },
      { label: '99%', multiplier: 2.576 },
      { label: '99.9%', multiplier: 3.291 },
      { label: '99.99%', multiplier: 3.891 },
      { label: '99.999%', multiplier: 4.417 },
      { label: '99.9999%', multiplier: 4.892 },
    ];

    const confidenceIntervals = levels.map(l => {
      const margin = l.multiplier * sem;
      const percent = (margin / mean) * 100;
      return {
        level: l.label,
        formula: `${l.multiplier === 1 ? '' : l.multiplier}${type === 'population' ? 'σx̄' : 'sx̄'}`,
        range: `${mean.toFixed(type === 'population' ? 0 : 0)} ±${margin.toFixed(3)} (±${percent.toFixed(2)}%)`
      };
    });

    // Frequency Table
    const counts: Record<number, number> = {};
    rawNumbers.forEach(num => counts[num] = (counts[num] || 0) + 1);
    const freqTable = Object.keys(counts).map(Number).sort((a, b) => a - b).map(val => ({
      val,
      freq: counts[val],
      percent: (counts[val] / n) * 100
    }));

    return {
      n,
      sum,
      mean,
      variance,
      stdDev,
      sem,
      sumSqDiff,
      confidenceIntervals,
      freqTable
    };
  }, [dataInput, type]);

  return (
    <CalculatorWrapper
      title="Standard Deviation Calculator"
      description="Calculate standard deviation, variance, mean, and margin of error for a given set of data points."
      icon={Sigma}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Enter Data Points</Label>
                <Textarea 
                  placeholder="e.g. 10, 12, 23, 23, 16..." 
                  className="min-h-[120px] font-mono"
                  value={dataInput}
                  onChange={(e) => setDataInput(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground italic">Separate numbers by commas, spaces, or new lines.</p>
              </div>

              <div className="space-y-3">
                <Label>Calculation Mode</Label>
                <RadioGroup value={type} onValueChange={(v: any) => setType(v)} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="population" id="pop" />
                    <Label htmlFor="pop" className="cursor-pointer">Population</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sample" id="samp" />
                    <Label htmlFor="samp" className="cursor-pointer">Sample</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                <Info className="w-4 h-4" />
                Quick Tip
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Use <strong>Population</strong> if your data includes every member of the group. Use <strong>Sample</strong> if you are analyzing a subset to represent a larger group.
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 space-y-6">
          {!results ? (
            <Card className="bg-muted/30 border-dashed border-2 p-12 flex items-center justify-center text-muted-foreground italic text-center">
              Please enter at least two valid data points to see results.
            </Card>
          ) : (
            <>
              <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sigma className="w-32 h-32" />
                </div>
                <CardContent className="pt-10 pb-10 text-center relative z-10 space-y-4">
                  <p className="text-xs uppercase tracking-widest opacity-80 font-bold">
                    Standard Deviation ({type === 'population' ? 'σ' : 's'})
                  </p>
                  <h3 className="text-5xl md:text-6xl font-black font-headline tracking-tighter">
                    {results.stdDev.toLocaleString(undefined, { maximumFractionDigits: 10 })}
                  </h3>
                  <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] opacity-60 uppercase font-bold">Count (N)</p>
                      <p className="text-lg font-bold">{results.n}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] opacity-60 uppercase font-bold">Sum (Σx)</p>
                      <p className="text-lg font-bold">{results.sum}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] opacity-60 uppercase font-bold">Mean ({type === 'population' ? 'μ' : 'x̄'})</p>
                      <p className="text-lg font-bold">{results.mean.toLocaleString(undefined, { maximumFractionDigits: 4 })}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] opacity-60 uppercase font-bold">Variance ({type === 'population' ? 'σ²' : 's²'})</p>
                      <p className="text-lg font-bold">{results.variance.toLocaleString(undefined, { maximumFractionDigits: 4 })}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-2 font-bold"
                  onClick={() => setShowSteps(!showSteps)}
                >
                  {showSteps ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  Show Calculation Steps
                </Button>

                {showSteps && (
                  <Card className="bg-slate-50 border-2 border-dashed animate-in fade-in slide-in-from-top-2">
                    <CardContent className="pt-6 space-y-4 font-mono text-xs text-muted-foreground">
                      <div className="space-y-1">
                        <p className="text-primary font-bold">1. Find the Mean:</p>
                        <p>{type === 'population' ? 'μ' : 'x̄'} = Σx / N = {results.sum} / {results.n} = {results.mean}</p>
                      </div>
                      <Separator />
                      <div className="space-y-1">
                        <p className="text-primary font-bold">2. Find the Variance:</p>
                        <p>{type === 'population' ? 'σ²' : 's²'} = Σ(xi - {type === 'population' ? 'μ' : 'x̄'})² / {type === 'population' ? 'N' : 'N - 1'}</p>
                        <p>= {results.sumSqDiff.toFixed(4)} / {type === 'population' ? results.n : results.n - 1}</p>
                        <p>= {results.variance.toFixed(10)}</p>
                      </div>
                      <Separator />
                      <div className="space-y-1">
                        <p className="text-primary font-bold">3. Find the Standard Deviation:</p>
                        <p>{type === 'population' ? 'σ' : 's'} = √{results.variance.toFixed(6)}</p>
                        <p>= {results.stdDev.toFixed(10)}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Confidence Interval Table */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <History className="w-4 h-4 text-primary" />
                    Margin of Error (Confidence Interval)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="font-bold text-[10px] uppercase">Level</TableHead>
                        <TableHead className="font-bold text-[10px] uppercase">Margin of Error</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.confidenceIntervals.map((ci) => (
                        <TableRow key={ci.level}>
                          <TableCell className="text-xs py-2">
                            <span className="font-bold">{ci.level}</span>
                            <span className="ml-2 text-muted-foreground opacity-60">, {ci.formula}</span>
                          </TableCell>
                          <TableCell className="text-right text-xs font-mono font-bold text-primary py-2">{ci.range}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="bg-blue-50 p-4 border-t border-blue-100 flex gap-3">
                    <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-blue-700 leading-relaxed italic">
                      SEM ({type === 'population' ? 'σx̄' : 'sx̄'}) = {results.sem.toFixed(10)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Frequency Table */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-accent" />
                    Frequency Table
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="text-[10px] font-bold uppercase">Value</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase">Frequency</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.freqTable.map((row) => (
                        <TableRow key={row.val}>
                          <TableCell className="text-xs font-bold">{row.val}</TableCell>
                          <TableCell className="text-right text-xs font-medium">
                            {row.freq} <span className="text-muted-foreground ml-2">({row.percent.toFixed(1)}%)</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Informational Text Section */}
        <div className="lg:col-span-12 py-10 space-y-12">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Master Statistical Data Analysis with MyApexCalc
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Whether you are analyzing test scores in a classroom, assessing risk in a financial portfolio, evaluating quality control metrics in manufacturing, or processing scientific research observations, understanding how data spreads out is critical. While the average (mean) gives you a central starting point, it doesn't tell you if your numbers are closely grouped or wildly scattered. Our free online Standard Deviation Calculator takes the pain out of statistics, serving as an instant tool for determining standard deviation, variance, and mean with a single click.
              </p>
              
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
                <Calculator className="w-6 h-6" />
                Understanding the Mathematics: How to Find the Standard Deviation
              </h3>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Standard deviation measures the average distance of each data point in a set from the mean of that set. To find the standard deviation of your data, the calculation engine runs through several steps.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  First, we calculate the arithmetic mean (&mu; or x&#772;) of the dataset. Next, we find the squared difference of each individual data point (x<sub>i</sub>) from that mean. Finally, we sum those squared differences and calculate the average. The exact equation for standard deviation depends entirely on whether your data represents an entire population or just a sample size:
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="font-bold text-sm text-foreground">1. Sample Standard Deviation (s)</p>
                    <p className="text-sm text-muted-foreground">Use this Standard Deviation formula if your dataset is a representative subset of a larger group. It utilizes Bessel's correction (n - 1) in the denominator to correct for bias:</p>
                    <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                      s = &radic;[ &Sigma;(x<sub>i</sub> - x&#772;)&sup2; / (n - 1) ]
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-sm text-foreground">2. Population Standard Deviation (&sigma;)</p>
                    <p className="text-sm text-muted-foreground">Use this calculation if your dataset represents every single member of the group you are evaluating (such as every student in a single school class):</p>
                    <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                      &sigma; = &radic;[ &Sigma;(x<sub>i</sub> - &mu;)&sup2; / n ]
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[10px] text-muted-foreground bg-muted/20 p-4 rounded-xl">
                  <p><strong>x<sub>i</sub></strong>: individual value</p>
                  <p><strong>x&#772; / &mu;</strong>: arithmetic mean</p>
                  <p><strong>n</strong>: total data points</p>
                  <p><strong>&Sigma;</strong>: summation symbol</p>
                </div>
              </div>
            </section>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  Step-by-Step Practical Example
                </h4>
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>Let's analyze a simple sample dataset of five numbers: <strong>2, 4, 4, 4, 5.5</strong>.</p>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="font-bold text-foreground">Step 1: Find the Mean</p>
                      <p>Mean (x&#772;) = (2 + 4 + 4 + 4 + 5.5) / 5 = 19.5 / 5 = <strong>3.9</strong></p>
                    </div>
                    
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="font-bold text-foreground">Step 2: Subtract Mean and Square Result</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>(2 - 3.9)&sup2; = 3.61</li>
                        <li>(4 - 3.9)&sup2; = 0.01 (x3)</li>
                        <li>(5.5 - 3.9)&sup2; = 2.56</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="font-bold text-foreground">Step 3: Sum the Squares</p>
                      <p>&Sigma; = 3.61 + 0.01 + 0.01 + 0.01 + 2.56 = <strong>6.2</strong></p>
                    </div>

                    <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg">
                      <p className="font-bold text-primary">Step 4: Final Result</p>
                      <p>Variance (s&sup2;) = 6.2 / (5 - 1) = <strong>1.55</strong></p>
                      <p>Standard Deviation (s) = &radic;1.55 &approx; <strong>1.245</strong></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  Why Choose MyApexCalc?
                </h4>
                <ul className="space-y-6 pt-2">
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Side-by-Side Results</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">View both Sample and Population calculations instantly so you never have to worry about selecting the wrong option beforehand.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                      <LayoutGrid className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Flexible Input Formats</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Simply paste your raw numbers separated by commas, spaces, or line breaks to process your data immediately.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
