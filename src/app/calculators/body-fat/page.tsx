"use client"

import { useState, useMemo, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Activity, 
  Info, 
  User, 
  History, 
  TrendingUp, 
  ChevronRight,
  ShieldCheck,
  Target,
  Calculator,
  BarChart
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Accurate Body Fat Calculator | Free Body Composition Tracker',
  description: 'Calculate your percentage of body fat instantly. Use our free online body fat calculator to estimate body composition using standard measurements.',
  keywords: [
    'calculator bmi female',
    'body fat index',
    'percentage of body fat',
    'body fat calculator',
    'MyApexCalc',
    'body composition estimator',
    'US Navy body fat method'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Precision Body Fat Calculator & Composition Tracker | MyApexCalc',
    description: 'Track your fitness progress beyond the scale. Estimate your body fat index and lean mass percentages in seconds.',
    url: 'https://www.myapexcalc.com/calculators/body-fat',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/TqJgSVm5/body-fat-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Body Fat Calculator and Body Composition Visualizer',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Free Body Fat & Lean Mass Estimator | MyApexCalc',
    description: 'Understand your body composition. Calculate body fat percentages instantly using simple measurements.',
    images: ['https://i.ibb.co/TqJgSVm5/body-fat-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/body-fat',
  },
};

type Gender = 'male' | 'female';
type UnitMode = 'us' | 'metric';

const jacksonPollockData = [
  { age: 20, women: 17.7, men: 8.5 },
  { age: 25, women: 18.4, men: 10.5 },
  { age: 30, women: 19.3, men: 12.7 },
  { age: 35, women: 21.5, men: 13.7 },
  { age: 40, women: 22.2, men: 15.3 },
  { age: 45, women: 22.9, men: 16.4 },
  { age: 50, women: 25.2, men: 18.9 },
  { age: 55, women: 26.3, men: 20.9 },
];

export default function BodyFatCalculatorPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState<UnitMode>('us');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(152);

  // US Mode (Feet + Inches)
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(10);
  const [neckFt, setNeckFt] = useState(1);
  const [neckIn, setNeckIn] = useState(7.5);
  const [waistFt, setWaistFt] = useState(3);
  const [waistIn, setWaistIn] = useState(1.5);
  const [hipFt, setHipFt] = useState(2);
  const [hipIn, setHipIn] = useState(10.5);

  // Metric Mode (Single CM value)
  const [heightCm, setHeightCm] = useState(177.8);
  const [neckCm, setNeckCm] = useState(49.5);
  const [waistCm, setWaistCm] = useState(95.3);
  const [hipCm, setHipCm] = useState(87.6);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const results = useMemo(() => {
    if (!isMounted) return null;

    let h_cm = 0, w_cm = 0, n_cm = 0, hip_cm = 0;
    const w_lbs = mode === 'us' ? weight : weight / 0.453592;

    if (mode === 'us') {
      h_cm = ((heightFt * 12) + heightIn) * 2.54;
      w_cm = ((waistFt * 12) + waistIn) * 2.54;
      n_cm = ((neckFt * 12) + neckIn) * 2.54;
      hip_cm = ((hipFt * 12) + hipIn) * 2.54;
    } else {
      h_cm = heightCm;
      w_cm = waistCm;
      n_cm = neckCm;
      hip_cm = hipCm;
    }

    let bodyFat = 0;
    if (gender === 'male') {
      // High-precision density Navy Formula for Men
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(w_cm - n_cm) + 0.15456 * Math.log10(h_cm)) - 450;
    } else {
      // High-precision density Navy Formula for Women
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(w_cm + hip_cm - n_cm) + 0.22100 * Math.log10(h_cm)) - 450;
    }

    if (isNaN(bodyFat) || bodyFat < 0) return null;

    const bodyFatMass = w_lbs * (bodyFat / 100);
    const leanBodyMass = w_lbs - bodyFatMass;

    // BMI Method estimation
    const h_m = h_cm / 100;
    const w_kg = w_lbs * 0.453592;
    const bmi = w_kg / (h_m * h_m);
    const bmiBodyFat = (1.20 * bmi) + (0.23 * age) - (10.8 * (gender === 'male' ? 1 : 0)) - 5.4;

    // Ideal BF (Jackson & Pollock)
    const closestAgeRow = jacksonPollockData.reduce((prev, curr) => 
      Math.abs(curr.age - age) < Math.abs(prev.age - age) ? curr : prev
    );
    const idealBf = gender === 'male' ? closestAgeRow.men : closestAgeRow.women;
    const bfToLose = Math.max(0, bodyFatMass - (w_lbs * (idealBf / 100)));

    // Category Logic (ACE)
    let category = '';
    let categoryColor = '';
    if (gender === 'male') {
      if (bodyFat < 6) { category = 'Essential Fat'; categoryColor = 'text-blue-500'; }
      else if (bodyFat < 14) { category = 'Athlete'; categoryColor = 'text-green-500'; }
      else if (bodyFat < 18) { category = 'Fitness'; categoryColor = 'text-emerald-600'; }
      else if (bodyFat < 25) { category = 'Acceptable'; categoryColor = 'text-yellow-600'; }
      else { category = 'Obese'; categoryColor = 'text-red-500'; }
    } else {
      if (bodyFat < 14) { category = 'Essential Fat'; categoryColor = 'text-blue-500'; }
      else if (bodyFat < 21) { category = 'Athlete'; categoryColor = 'text-green-500'; }
      else if (bodyFat < 25) { category = 'Fitness'; categoryColor = 'text-emerald-600'; }
      else if (bodyFat < 32) { category = 'Acceptable'; categoryColor = 'text-yellow-600'; }
      else { category = 'Obese'; categoryColor = 'text-red-500'; }
    }

    return {
      bodyFat,
      category,
      categoryColor,
      bodyFatMass,
      leanBodyMass,
      idealBf,
      bfToLose,
      bmiBodyFat
    };
  }, [isMounted, mode, gender, age, weight, heightFt, heightIn, neckFt, neckIn, waistFt, waistIn, hipFt, hipIn, heightCm, neckCm, waistCm, hipCm]);

  const toggleMode = (newMode: UnitMode) => {
    if (newMode === mode) return;
    if (newMode === 'metric') {
      setHeightCm(Number(((heightFt * 12 + heightIn) * 2.54).toFixed(1)));
      setWeight(Number((weight * 0.453592).toFixed(1)));
      setNeckCm(Number(((neckFt * 12 + neckIn) * 2.54).toFixed(1)));
      setWaistCm(Number(((waistFt * 12 + waistIn) * 2.54).toFixed(1)));
      setHipCm(Number(((hipFt * 12 + hipIn) * 2.54).toFixed(1)));
    } else {
      const totalHIn = heightCm / 2.54;
      setHeightFt(Math.floor(totalHIn / 12));
      setHeightIn(Number((totalHIn % 12).toFixed(1)));
      setWeight(Number((weight / 0.453592).toFixed(1)));
      const totalNIn = neckCm / 2.54;
      setNeckFt(Math.floor(totalNIn / 12));
      setNeckIn(Number((totalNIn % 12).toFixed(1)));
      const totalWIn = waistCm / 2.54;
      setWaistFt(Math.floor(totalWIn / 12));
      setWaistIn(Number((totalWIn % 12).toFixed(1)));
      const totalHipIn = hipCm / 2.54;
      setHipFt(Math.floor(totalHipIn / 12));
      setHipIn(Number((totalHipIn % 12).toFixed(1)));
    }
    setMode(newMode);
  };

  return (
    <CalculatorWrapper
      title="Body Fat Calculator"
      description="Estimate your body fat percentage using the U.S. Navy formula and determine your health category."
      icon={Activity}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <Tabs value={mode} onValueChange={(v: any) => toggleMode(v)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="us">US Units</TabsTrigger>
                  <TabsTrigger value="metric">Metric Units</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gender</Label>
                  <RadioGroup value={gender} onValueChange={(v: any) => setGender(v)} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="cursor-pointer">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="cursor-pointer">Female</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Age</Label>
                    <Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Weight ({mode === 'us' ? 'lbs' : 'kg'})
                    </Label>
                    <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
                  </div>
                </div>

                {mode === 'us' ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Height</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <Input type="number" value={heightFt} onChange={(e) => setHeightFt(Number(e.target.value))} className="pr-7" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">ft</span>
                        </div>
                        <div className="relative">
                          <Input type="number" step="0.1" value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value))} className="pr-7" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">in</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Neck</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <Input type="number" value={neckFt} onChange={(e) => setNeckFt(Number(e.target.value))} className="pr-7" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">ft</span>
                        </div>
                        <div className="relative">
                          <Input type="number" step="0.1" value={neckIn} onChange={(e) => setNeckIn(Number(e.target.value))} className="pr-7" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">in</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Waist</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <Input type="number" value={waistFt} onChange={(e) => setWaistFt(Number(e.target.value))} className="pr-7" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">ft</span>
                        </div>
                        <div className="relative">
                          <Input type="number" step="0.1" value={waistIn} onChange={(e) => setWaistIn(Number(e.target.value))} className="pr-7" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">in</span>
                        </div>
                      </div>
                    </div>

                    {gender === 'female' && (
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Hip</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="relative">
                            <Input type="number" value={hipFt} onChange={(e) => setHipFt(Number(e.target.value))} className="pr-7" />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">ft</span>
                          </div>
                          <div className="relative">
                            <Input type="number" step="0.1" value={hipIn} onChange={(e) => setHipIn(Number(e.target.value))} className="pr-7" />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">in</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Height (cm)</Label>
                      <Input type="number" step="0.1" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Neck (cm)</Label>
                      <Input type="number" step="0.1" value={neckCm} onChange={(e) => setNeckCm(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Waist (cm)</Label>
                      <Input type="number" step="0.1" value={waistCm} onChange={(e) => setWaistCm(Number(e.target.value))} />
                    </div>
                    {gender === 'female' && (
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Hip (cm)</Label>
                        <Input type="number" step="0.1" value={hipCm} onChange={(e) => setHipCm(Number(e.target.value))} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {!results ? (
            <Card className="bg-muted/30 border-dashed border-2 p-12 flex items-center justify-center text-muted-foreground italic">
              Please enter your measurements to see results.
            </Card>
          ) : (
            <>
              <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Activity className="w-24 h-24" />
                </div>
                <CardContent className="pt-10 pb-10 text-center relative z-10 space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest opacity-80 mb-2 font-bold">Estimated Body Fat</p>
                    <h3 className="text-6xl md:text-7xl font-black font-headline tracking-tighter">
                      {results.bodyFat.toFixed(1)}%
                    </h3>
                  </div>
                  
                  <div className="space-y-4 max-w-sm mx-auto">
                    <div className="bg-white/10 p-2 px-6 rounded-full inline-block border border-white/20">
                      <p className="text-xs font-bold uppercase tracking-widest">
                        Category: <span className="text-accent-foreground font-black">{results.category}</span>
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-80">
                        <span>Body Fat Index</span>
                        <span>{results.category}</span>
                      </div>
                      <Progress value={results.bodyFat * 2} className="h-2 bg-white/20" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Composition Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground font-medium">Body Fat Mass</span>
                      <span className="font-bold">{results.bodyFatMass.toFixed(1)} lbs</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground font-medium">Lean Body Mass</span>
                      <span className="font-bold">{results.leanBodyMass.toFixed(1)} lbs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">BMI Method Est.</span>
                      <span className="font-bold text-muted-foreground">{results.bmiBodyFat.toFixed(1)}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-accent/5 border-accent/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-accent">
                      <Target className="w-4 h-4" />
                      Goal Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground font-medium">Ideal BF (for age)</span>
                      <span className="font-bold text-primary">{results.idealBf}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">Fat to lose for ideal</span>
                      <span className="font-bold text-accent">{results.bfToLose.toFixed(1)} lbs</span>
                    </div>
                    <Separator />
                    <p className="text-[10px] text-muted-foreground leading-tight italic">
                      Ideal percentage based on Jackson & Pollock benchmark for age {age}.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>

        {/* Informational Section */}
        <div className="lg:col-span-12 py-10 space-y-12">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Understand Your Body Composition with MyApexCalc
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                When embarking on a health, fitness, or weight management journey, relying solely on a standard bathroom scale can often be misleading. Muscle tissue is denser than fat tissue; as you burn fat and build lean muscle, your weight might stay exactly the same even though your physical shape is transforming. To get a true picture of your physical fitness, you need to track your percentage of body fat. Our free online body fat calculator is designed to provide an instant, accessible estimate of your overall body composition without requiring expensive clinical scans.
              </p>
              
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
                <Calculator className="w-6 h-6" />
                The Science of Body Composition: Tracking Your Index
              </h3>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Our calculator utilizes two widely accepted scientific methods to evaluate your body fat index: the U.S. Navy Body Fat Method (which uses tape measurements) and the BMI-to-Body-Fat Conversion Method.
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="font-bold text-sm text-foreground">1. The U.S. Navy Circumference Method</p>
                    <p className="text-sm text-muted-foreground">Considered the gold standard for home estimation, this formula requires simple neck, waist, and hip circumference measurements along with your height. Because men and women store fat differently, the equations utilize distinct physical calculations:</p>
                    <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm space-y-4 border overflow-x-auto">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-primary">For Men (Measurements in Centimeters):</p>
                        <p>BFP = 86.010 × log₁₀(Waist - Neck) - 70.041 × log₁₀(Height) + 36.76</p>
                      </div>
                      <Separator />
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-primary">For Women (Measurements in Centimeters):</p>
                        <p>BFP = 163.205 × log₁₀(Waist + Hips - Neck) - 97.684 × log₁₀(Height) - 78.387</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-sm text-foreground">2. The BMI-Based Estimation Method</p>
                    <p className="text-sm text-muted-foreground">For a quick estimate that doesn't require a measuring tape, you can run a calculation using your Body Mass Index (BMI). While a standard calculator bmi female or male tool only evaluates height against weight, this equation translates that baseline into a broad body fat approximation:</p>
                    <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                      Body Fat % (Adult) = (1.20 × BMI) + (0.23 × Age) - (10.8 × Gender) - 5.4
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 italic">
                      * (Note: In this formula, Gender is assigned a value of 1 for biological males and 0 for biological females.)
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-accent" />
                  Body Fat Categories: Where Do You Stand?
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Once our tool estimates your percentage, it aligns your results with standard fitness classifications to help you set realistic, healthy goals:
                </p>
                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="font-bold">Classification</TableHead>
                        <TableHead className="font-bold">Women's Range</TableHead>
                        <TableHead className="text-right font-bold">Men's Range</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-xs">Essential Fat</TableCell>
                        <TableCell className="text-xs">10% - 13%</TableCell>
                        <TableCell className="text-right text-xs">2% - 5%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-xs">Athletes</TableCell>
                        <TableCell className="text-xs">14% - 20%</TableCell>
                        <TableCell className="text-right text-xs">6% - 13%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-xs font-bold text-emerald-600">Fitness</TableCell>
                        <TableCell className="text-xs">21% - 24%</TableCell>
                        <TableCell className="text-right text-xs">14% - 17%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-xs">Acceptable</TableCell>
                        <TableCell className="text-xs">25% - 31%</TableCell>
                        <TableCell className="text-right text-xs">18% - 24%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-xs font-bold text-red-500">Obesity</TableCell>
                        <TableCell className="text-xs">32%+</TableCell>
                        <TableCell className="text-right text-xs">25%+</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Info className="w-5 h-5 text-accent" />
                  Why Measure Body Fat with MyApexCalc?
                </h4>
                <ul className="space-y-6 pt-2">
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Dual-Method Calculations</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Choose between tape measurements for higher precision or rapid BMI-based estimates depending on your goals.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                      <History className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Metric and Imperial Support</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Input measurements seamlessly in inches or centimeters, and weight in pounds or kilograms without conversion friction.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Privacy-First Tracking</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Calculate and evaluate your personal health details privately, with zero mandatory user profiles or data tracking.</p>
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
